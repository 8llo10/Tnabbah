

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const OpenAI = require('openai')
const supabase = require('./supabase')

const latestSnapshots = {}

const app = express()

// =======================
// MIDDLEWARE
// =======================
app.use(cors())
app.use(express.json())

// =======================
// OPENAI
// =======================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
//---------------------------------------------------------------------------------------

const LIVE_METRICS = {

  engineTemp: { label: 'حرارة المحرك', unit: '°C' },

  oilTemp: { label: 'حرارة زيت المكينة', unit: '°C' },

  batteryVoltage: { label: 'فولت البطارية', unit: 'V' },

  rpm: { label: 'عدد لفات المحرك RPM', unit: '' },

  speed: { label: 'السرعة', unit: 'km/h' },

  fuelPressure: { label: 'ضغط الوقود', unit: 'kPa' },

  mapPressure: { label: 'ضغط الهواء داخل المكينة MAP', unit: 'kPa' },

  intakeTemp: { label: 'حرارة الهواء الداخل', unit: '°C' },

  engineLoad: { label: 'حمل المحرك', unit: '%' },

  throttlePosition: { label: 'فتحة الدعسة', unit: '%' },

}



async function resolveLiveMetric(message) {

  const result = await openai.chat.completions.create({

    model: 'gpt-4o-mini',

    temperature: 0,

    messages: [

      {

        role: 'system',

        content: `

حدد هل المستخدم يسأل عن قراءة مباشرة من السيارة.

ارجع فقط واحد من هذه القيم:

engineTemp, oilTemp, batteryVoltage, rpm, speed, fuelPressure, mapPressure, intakeTemp, engineLoad, throttlePosition, NONE

`

      },

      { role: 'user', content: message }

    ]

  })



  const key = result?.choices?.[0]?.message?.content?.trim()

  return LIVE_METRICS[key] ? key : null

}


//---------------------------------------------------------------------------------------------------------------------------------------


// =======================
// TEST ROUTE
// =======================
app.get('/', (req, res) => {
  res.send('🚗 Tanaabbuh AI Backend Running')
})

// =======================
// HEALTH CHECK (NEW)
// =======================
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running 🚗' })
})

// =======================
// LIVE SNAPSHOT CACHE
// =======================
app.post('/snapshot', (req, res) => {

  const { userId, carId, snapshot } = req.body

  if (!userId || !snapshot) {
    return res.status(400).json({
      ok: false,
      error: 'missing_data'
    })
  }

  latestSnapshots[userId] = latestSnapshots[userId] || {}

  latestSnapshots[userId][carId] = {
    snapshot,
    updatedAt: Date.now(),
  }

  console.log('📡 Snapshot Updated:', userId)

  return res.json({
    ok: true
  })
})

// =======================
// HELPERS
// =======================

// =======================
// GREETING DETECTION
// =======================
function isGreeting(message) {

  const greetings = [
    'مرحبا',
    'السلام عليكم',
    'اهلا',
    'هلا',
    'hello',
    'hi'
  ]

  return greetings.some(g =>
    message.toLowerCase().includes(g.toLowerCase())
  )
}

// =======================
// CAR QUESTION DETECTION
// =======================
function isCarRelatedQuestion(message) {

  const keywords = [
    'سيارتي',
    'السيارة',
    'فحص',
    'تقرير',
    'عطل',
    'مشكلة',
    'مشاكل',
    'زيت',
    'صيانة',
    'المحرك',
    'البطارية',
    'الفرامل',
    'الراديتر',
    'حرارة',
    'كم باقي',
    'حالة السيارة',
    'تقييم السيارة',
    'كيف حالة سيارتي',
    'oil',
    'engine',
    'car',
    'problem'
  ]

  return keywords.some(word =>
    message.toLowerCase().includes(word.toLowerCase())
  )
}

// =======================
// VEHICLE HEALTH QUESTION
// =======================
function isVehicleHealthQuestion(message) {

  const keywords = [
    'كيف حالة سيارتي',
    'قيم السيارة',
    'تقييم السيارة',
    'كيف وضع السيارة',
    'هل السيارة جيدة',
    'هل السيارة سليمة',
    'حالة السيارة'
  ]

  return keywords.some(word =>
    message.includes(word)
  )
}

// =======================
// FORMAT VEHICLE ISSUES
// =======================
function formatIssues(content) {

  const report = content?.user_friendly_report_ar

  if (!report || !report.issues || report.issues.length === 0) {
    return 'لا توجد مشاكل مسجلة في آخر فحص'
  }

  return report.issues.map((issue, index) => {

    const symptoms =
      issue.symptoms?.join(' - ') || 'لا توجد أعراض'

    const causes =
      issue.possible_causes?.join(' - ') || 'غير معروفة'

    return `
🚨 المشكلة ${index + 1}:

🔧 وصف المشكلة:
${issue.explanation || issue.title || 'غير متوفر'}

⚠️ مستوى الخطورة:
${issue.severity_label || issue.severity || 'غير محدد'}

🧩 الأعراض:
${symptoms}

📌 الأسباب المحتملة:
${causes}

✅ الحل المقترح:
${issue.what_to_do || 'يفضل فحص السيارة لدى مختص'}
`
  }).join('\n')
}

// =======================
// VEHICLE SUMMARY
// =======================
function buildVehicleSummary(content) {

  const health =
    content?.analysis_metadata?.overall_health || 0

  const issues =
    content?.user_friendly_report_ar?.issues || []

  const driveAdvice =
    content?.drive_advice || 'غير متوفر'

  let status = ''


  if (health >= 80) {
    status = '🟢 السيارة بحالة جيدة'
  }
  else if (health >= 50) {
    status = '🟡 السيارة تحتاج متابعة'
  }
  else {
    status = '🔴 السيارة تحتاج فحص عاجل'
  }


  let positives = []

  const pidReadings =
    content?.all_pid_readings || []

  pidReadings.forEach(pid => {

    if (pid.status === 'NORMAL') {
      positives.push(pid.pid_name_ar)
    }

  })

  positives = positives.slice(0, 5)

  return `
🚗 التقييم العام للسيارة:

${status}

📊 نسبة صحة السيارة:
${health}%

🚨 عدد المشاكل المكتشفة:
${issues.length}

🚗 حالة القيادة:
${driveAdvice}

✅ الأمور الجيدة:
${positives.join(' - ') || 'لا توجد بيانات'}

⚠️ تحتاج متابعة:
${issues.length > 0
      ? 'يوجد بعض المشاكل التي تحتاج فحص'
      : 'لا توجد مشاكل حالياً'
    }
`
}


function formatList(list) {
  return Array.isArray(list) && list.length
    ? list.join(', ')
    : 'غير متوفر'
}

function formatTopAlerts(alerts = []) {
  if (!Array.isArray(alerts) || alerts.length === 0) {
    return 'لا توجد تنبيهات مهمة حالياً'
  }

  return alerts.map((a, i) => `
${i + 1}. ${a.simpleName || a.title || 'تنبيه'}
- المستوى: ${a.levelText || a.level || 'غير محدد'}
- الرسالة: ${a.message || a.userMeaning || 'غير متوفر'}
- القيمة: ${a.displayValue || a.value || 'غير متوفرة'}
`).join('\n')
}

// =======================
// CHAT ENDPOINT
// =======================
app.post('/chat', async (req, res) => {

  const {
    message,
    userId,
    carId,
    userCarId,
    connectedCarId,
    currentCar,
    userCars = [],
    fullName,
    language,
    sessionId,
  } = req.body

  console.log('====================')
  console.log('USER ID:', userId)
  console.log('MESSAGE:', message)
  console.log('====================')

  if (!userId) {
    return res.json({
      reply: '❌ userId is required'
    })
  }

  const { data: dbCars } = await supabase
    .from('user_cars')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('last_connected_at', { ascending: false })

  const carsSource =
    Array.isArray(dbCars) && dbCars.length
      ? dbCars
      : userCars


  const chatSessionKey = sessionId || `session-${Date.now()}`;

  const firstWords = message
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 35);

  await supabase
    .from('chat_sessions')
    .upsert({
      user_id: userId,
      session_key: chatSessionKey,
      title: firstWords || 'محادثة جديدة',
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'session_key'
    });


  const currentCarName =
    currentCar?.display_name ||
    currentCar?.car_id ||
    carId ||
    'غير محددة'

  const connectedCarName =
    carsSource.find(car => car.car_id === connectedCarId)?.display_name ||
    connectedCarId ||
    'لا توجد سيارة متصلة الآن'

  const liveSnapshot =
    carId && latestSnapshots[userId]
      ? latestSnapshots[userId][carId] || null
      : null

  const hasLiveData = !!liveSnapshot?.snapshot
  const carsText =
    Array.isArray(carsSource) && carsSource.length
      ? carsSource.map((car, index) => {
        const name = car.display_name || car.car_id
        const isCurrent = car.id === userCarId || car.car_id === carId
        const isConnected = car.car_id === connectedCarId

        return `${index + 1}. ${name}${isCurrent ? ' ← السيارة الحالية' : ''}${isConnected ? ' ← متصلة الآن' : ''}`
      }).join('\n')
      : 'لا توجد سيارات محفوظة'

  if (
    isGreeting(message) &&
    !isCarRelatedQuestion(message)
  ) {

    return res.json({
      reply: 'أهلاً، أنا مساعدك الذكي تنبه 🚗 كيف يمكنني مساعدتك اليوم بخصوص سيارتك؟'
    })
  }

  try {


    let carContext = ''


    console.log("CHAT CAR ID:", carId)
    console.log("HAS SNAPSHOT:", !!liveSnapshot)
    console.log("SNAPSHOT:", liveSnapshot)

    let liveDataText = ''

    if (liveSnapshot?.snapshot) {

      const s = liveSnapshot.snapshot

      liveDataText = `
📡 بيانات السيارة الحية من Cortex:

🔌 حالة الاتصال:
OBD: ${s.status?.obdConnected ? 'متصل' : 'غير متصل'}
Streaming: ${s.status?.streaming ? 'شغال' : 'متوقف'}

🚗 السرعة:
${s.speed ?? 'غير متوفرة'} km/h

🌡️ حرارة المحرك:
${s.engineTemp ?? 'غير متوفرة'} °C

🛢️ حرارة زيت المكينة:
${s.oilTemp ?? 'غير متوفرة'} °C

🔋 البطارية:
${s.batteryVoltage ?? 'غير متوفرة'} V

🌀 RPM:
${s.rpm ?? 'غير متوفر'}

⛽ ضغط الوقود:
${s.fuelPressure ?? 'غير متوفر'} kPa

🌬️ ضغط الهواء داخل المكينة MAP:
${s.mapPressure ?? 'غير متوفر'} kPa

🌡️ حرارة الهواء الداخل:
${s.intakeTemp ?? 'غير متوفرة'} °C

⚙️ حمل المحرك:
${s.engineLoad ?? 'غير متوفر'}%

🦶 فتحة الدعسة:
${s.throttlePosition ?? 'غير متوفرة'}%

❤️ صحة السيارة:
${s.overallHealth ?? 'غير متوفرة'}%

📊 مستوى الحالة:
${s.healthText || s.healthLevel || 'غير متوفر'}

🚨 أهم التنبيهات:
${formatTopAlerts(s.topAlerts || s.alerts)}

✅ القراءات المتوفرة حالياً:
${formatList(s.availablePids)}

📌 القراءات المدعومة:
${formatList(s.supportedPids)}
`
    }

    let report = null
    let reportError = null

    if (userCarId) {
      const result = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .eq('user_car_id', userCarId)
        .in('status', ['pending', 'saved'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      report = result.data
      reportError = result.error
    }

    console.log('REPORT ERROR:', reportError)
    console.log('REPORT:', report)

    const hasReport = !!report
    const content = report?.content || null


    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    const { data: reminders } = await supabase
      .from('maintenance_reminders')
      .select(`
    reminder_id,
    next_date,
    is_active,
    maintenance_types (
      name
    )
  `)
      .eq('user_id', userId)
      .eq('is_active', true)

    const { data: unreadNotifications } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('is_read', false)

    const { data: savedReports } = await supabase
      .from('reports')
      .select('id')
      .eq('user_id', userId)
      .eq('is_permanently_saved', true)


    const appContext = `
📱 حالة التطبيق:

اللغة:
${userSettings?.language || 'AR'}

الوضع الداكن:
${userSettings?.dark_mode_enabled ? 'مفعل' : 'غير مفعل'}

التنبيهات:
${userSettings?.notifications_enabled ? 'مفعلة' : 'غير مفعلة'}

عدد السيارات:
${carsSource.length}

الصيانات النشطة:
${reminders?.length || 0}

التنبيهات غير المقروءة:
${unreadNotifications?.length || 0}

التقارير المحفوظة:
${savedReports?.length || 0}
`

    if (isCarRelatedQuestion(message)) {

      let vehicleSummary = ''

      if (isVehicleHealthQuestion(message)) {
        vehicleSummary =
          buildVehicleSummary(content)
      }


      carContext = `
${liveDataText}

${vehicleSummary}

🚗 تقرير السيارة من آخر فحص:

📊 الحالة العامة:
${content?.user_friendly_report_ar?.overall_health || 'غير متوفرة'}

📋 ملخص الفحص:
${content?.user_friendly_report_ar?.summary || 'لا يوجد'}

🚨 المشاكل المكتشفة:
${formatIssues(content)}

📌 التوصية النهائية:
${content?.user_friendly_report_ar?.final_recommendation?.recommendation_ar || 'لا توجد توصية'}

🚗 نصيحة القيادة:
${content?.drive_advice || 'غير متوفرة'}
`
    }


    const context = `
👤 بيانات المستخدم:
الاسم: ${fullName || 'غير معروف'}
اللغة: ${language || 'AR'}

🚗 سيارات المستخدم:
${carsText}

🚘 السيارة الحالية:
${currentCarName}

🔌 السيارة المتصلة الآن:
${connectedCarName}

📡 البيانات الحية:
${hasLiveData ? 'متوفرة' : 'غير متوفرة'}

📋 آخر تقرير:
${hasReport ? 'متوفر' : 'غير متوفر'}

${appContext}

${carContext}

👤 سؤال المستخدم:
${message}
`
    await supabase.from('chat_messages').insert({
      user_id: userId,
      role: 'user',
      message,
      session_id: sessionId || null,
      user_car_id: userCarId || null,
      car_id: carId || null,
      metadata: {
        currentCar,
        connectedCarId,
        hasLiveData,
        hasReport,
      },
    })

    const { data: historyRows } = await supabase
      .from('chat_messages')
      .select('role, message, created_at')
      .eq('user_id', userId)
      .eq('session_id', sessionId || '')
      .order('created_at', { ascending: false })
      .limit(11)

    const historyMessages = (historyRows || [])
      .reverse()
      .map((row) => ({
        role: row.role === 'assistant' ? 'assistant' : 'user',
        content: row.message,
      }))


    const lowerMessage = message.toLowerCase()

    if (
      lowerMessage.includes('كم سيارة') ||
      lowerMessage.includes('كم سياره') ||
      lowerMessage.includes('عدد سياراتي') ||
      lowerMessage.includes('سياراتي') ||
      lowerMessage.includes('وش سياراتي') ||
      lowerMessage.includes('اعرض سياراتي')
    ) {
      return res.json({
        reply:
          carsSource.length > 0
            ? `عندك ${carsSource.length} سيارة محفوظة:\n${carsSource
              .map((car, i) => `${i + 1}. ${car.display_name || 'السيارة الحالية'}`)
              .join('\n')}`
            : 'ما عندك سيارات محفوظة حالياً.'
      })
    }


    const metricKey = await resolveLiveMetric(message)

    if (metricKey && liveSnapshot?.snapshot) {
      const s = liveSnapshot.snapshot
      const metric = LIVE_METRICS[metricKey]
      const value = s[metricKey]

      return res.json({
        reply:
          value !== null && value !== undefined
            ? `${metric.label} الحالية: ${value}${metric.unit ? ` ${metric.unit}` : ''}.`
            : `حالياً ما وصلتني قراءة ${metric.label} من السيارة.`
      })
    }

    const response =
      await openai.chat.completions.create({

        model: 'gpt-4o-mini',

        messages: [

          {
            role: 'system',
            content: `
أنت مساعد سيارات ذكي اسمه "تنبه".

━━━━━━━━━━━━━━━━━━━━━━
🎯 شخصيتك:
- خبير سيارات ذكي
- تتحدث بطريقة بشرية
- تشرح الأعطال ببساطة
- تساعد المستخدم على فهم حالة سيارته

━━━━━━━━━━━━━━━━━━━━━━
🌍 اللغة:
- رد بنفس لغة المستخدم

━━━━━━━━━━━━━━━━━━━━━━
🚗 مهامك:
1️⃣ تفسير مشاكل السيارة
2️⃣ تقييم السيارة
3️⃣ التثقيف
4️⃣ التكاليف
5️⃣ الصيانة

━━━━━━━━━━━━━━━━━━━━━━
🚫 ممنوع:
- لا تذكر أكواد الأعطال أو PIDs إلا إذا المستخدم طلبها صراحة.
- عرض JSON
- بيانات خام

━━━━━━━━━━━━━━━━━━━━━━
💬 الأسلوب:
- سعودي بسيط ومريح.
- خلك ودود وتمون شوي بدون مبالغة.
- استخدم عبارات مثل: أبشري، خلينا نشوف، تمام، لا تشيلين هم، انتبهي.
- إذا السؤال عن السيارة الحالية أو حالة السيارة أو تقريرها أو قراءاتها، جاوب حسب السيارة الحالية في السياق.
- إذا جاوبت عن بيانات سيارة، وضح باختصار اسم السيارة مرة واحدة مثل: "عن كورولا..." أو "حسب آخر تقرير لكورولا...".
- إذا السؤال عام عن عالم السيارات، أسعار قطع، نصائح، صيانة عامة، أو شرح مفهوم، جاوب بشكل عام بدون ربطه بسيارة المستخدم إلا إذا كان مفيد.
- إذا المستخدم ما حدد سيارة والسؤال ممكن يخص أكثر من سيارة عنده، اعتمد على السيارة الحالية واسأله بلطف إذا يقصد سيارة ثانية.
- إذا سأل عن سياراته، اذكر السيارات المحفوظة والسيارة الحالية والمتصلة.
- إذا السيارة غير متصلة لكن فيه تقرير، وضح أن الكلام مبني على آخر تقرير محفوظ.
- إذا فيه بيانات حية، اعتمد عليها أولًا.
- إذا ما فيه بيانات حية ولا تقرير والسؤال يحتاج بيانات السيارة، قل له يحتاج يشبك القطعة أو ينشئ تقرير.
- لا تذكر أكواد الأعطال إلا إذا المستخدم طلبها صراحة.
- إذا سأل عن قراءة مباشرة مثل حرارة المحرك، البطارية، RPM، حرارة الزيت، ضغط الوقود، MAP، اعتمد على بيانات Cortex الحية أولاً.
- إذا القراءة غير موجودة لكن موجودة ضمن supportedPids أو availablePids، وضح أنها مدعومة أو متوفرة.
- إذا القراءة غير موجودة ولا مدعومة، قل له إن السيارة ما أرسلت هذه القراءة حالياً.
- إذا فيه topAlerts، استخدمها لتلخيص حالة السيارة بدل اختراع مشاكل.
- لا تعرض car_id أو user_car_id للمستخدم؛ إذا السيارة بلا اسم قل "السيارة الحالية" أو "السيارة المختارة".
- افهم مشاعر المستخدم من كلامه. إذا كان متوتر، طمّنه. إذا كان مستعجل، اختصر. إذا كان معصب، لا تعاند وادخل بالحل مباشرة.
- جاوب على أي سؤال يخص التطبيق أو المستخدم أو سياراته أو الصيانة أو التقارير أو التنبيهات أو عالم السيارات.
- إذا السؤال عام وليس له علاقة بسيارة المستخدم، جاوب بشكل عام بدون ما تربطه بسيارته.
- إذا السؤال عن بيانات المستخدم أو سياراته أو إعداداته أو تنبيهاته، استخدم السياق الموجود ولا تقول "ما أعرف" إلا إذا فعلاً غير موجود.
- إذا فيه أكثر من سيارة والمستخدم ما حدد، افترض السيارة الحالية/المختارة ووضح ذلك بهدوء.
`
          },

          ...historyMessages,

          {
            role: 'user',
            content: context
          }

        ],

        temperature: 0.3
      })


    const reply =
      response?.choices?.[0]?.message?.content || '❌ لا يوجد رد من الذكاء الاصطناعي'

    await supabase.from('chat_messages').insert({
      user_id: userId,
      role: 'assistant',
      message: reply,
      session_id: sessionId || null,
      user_car_id: userCarId || null,
      car_id: carId || null,
      metadata: {
        currentCar,
        connectedCarId,
        hasLiveData,
        hasReport,
      },
    })

    return res.json({ reply })

  } catch (err) {

    console.log('SERVER ERROR:', err)

    return res.json({
      reply: '❌ حدث خطأ في السيرفر'
    })
  }
})

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 4010

app.delete('/chat/session', async (req, res) => {
  const { userId, sessionId } = req.body

  if (!userId || !sessionId) {
    return res.status(400).json({ ok: false })
  }

  await supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', userId)
    .eq('session_id', sessionId)

  await supabase
    .from('chat_sessions')
    .delete()
    .eq('user_id', userId)
    .eq('session_key', sessionId)

  return res.json({ ok: true })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
