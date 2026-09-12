# TNABBAH System Overview

TNABBAH is a smart vehicle diagnostics and maintenance platform that connects to real vehicles through an ELM327 BLE OBD-II adapter.

## Main capabilities

- Live ECU data and DTC retrieval
- VIN-based vehicle identification
- Real-time telemetry through MQTT
- Smart diagnostic reports and severity assessment
- Maintenance recommendations and reminders
- Multi-vehicle management
- Vehicle-aware assistant conversations

## Architecture

- Mobile: React Native + Expo + TypeScript
- Backend: FastAPI and Node.js services
- Data: Supabase/PostgreSQL
- Messaging: MQTT/Mosquitto
- Integrations: BLE, REST APIs, Supabase Realtime
- Infrastructure: Ubuntu VPS
