<div align="center">

<img src="./assets/tnabbah-header.svg" alt="TNABBAH animated header" width="100%" />

<br />

<img src="./assets/logo.png" width="170" alt="TNABBAH Logo"/>

# TNABBAH — تنبَّه

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=30&pause=900&color=871B17&center=true&vCenter=true&width=950&height=75&lines=AI-Powered+Vehicle+Diagnostics;OBD-II+Bluetooth+%2B+AI;Real-Time+Vehicle+Monitoring;From+Fault+Codes+to+Clear+Decisions;Smart+Insights+for+Everyday+Drivers" alt="Typing Animation" />

**AI-Powered Vehicle Diagnostics & Intelligent Assistance Platform**

Transforming complex vehicle diagnostics into clear, actionable insights for everyday drivers.

<br />

<a href="https://youtu.be/310Nld7MZgo">
  <img src="https://img.shields.io/badge/Watch%20Demo-YouTube-871B17?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo on YouTube" />
</a>

<a href="./Demo.mp4">
  <img src="https://img.shields.io/badge/View%20Demo-GitHub-5F5F5F?style=for-the-badge&logo=github&logoColor=white" alt="View Demo on GitHub" />
</a>

<br /><br />

<img src="https://img.shields.io/badge/React%20Native-Mobile%20App-871B17?style=flat-square" alt="React Native" />
<img src="https://img.shields.io/badge/Expo-Framework-5F5F5F?style=flat-square" alt="Expo" />
<img src="https://img.shields.io/badge/FastAPI-Diagnostics%20Engine-871B17?style=flat-square" alt="FastAPI" />
<img src="https://img.shields.io/badge/MQTT-Real--Time%20Telemetry-5F5F5F?style=flat-square" alt="MQTT" />
<img src="https://img.shields.io/badge/Supabase-Cloud%20Backend-871B17?style=flat-square" alt="Supabase" />
<img src="https://img.shields.io/badge/OBD--II-Bluetooth%20Adapter-5F5F5F?style=flat-square" alt="OBD-II Bluetooth" />
<img src="https://img.shields.io/badge/AI-Smart%20Analysis-871B17?style=flat-square" alt="AI Analysis" />

</div>

---

## Project Demonstration

<div align="center">

<a href="https://youtu.be/310Nld7MZgo">
  <img src="./assets/demo-cover.png" width="850" alt="TNABBAH Demo Video"/>
</a>

<br /><br />

**Click the preview above to watch the full TNABBAH demonstration on YouTube.**

<br />

You can also view the repository-hosted demo:

**[▶ Open Demo.mp4](./Demo.mp4)**

</div>

---

## About TNABBAH

**TNABBAH** is a smart vehicle diagnostics platform that combines **OBD-II Bluetooth communication**, real-time monitoring, cloud infrastructure, and artificial intelligence to make vehicle diagnostics easier and more understandable for everyday drivers.

The platform connects directly to real vehicles through an **ELM327 BLE OBD-II adapter**, reads live vehicle data, retrieves diagnostic trouble codes, identifies vehicle information, monitors vehicle health, and transforms technical automotive data into clear reports and practical recommendations.

Instead of presenting drivers with raw diagnostic codes and sensor values alone, TNABBAH explains what the detected issue means, why it matters, how it may affect the vehicle, and what action can be taken next.

The platform also provides an intelligent automotive assistant capable of using vehicle-specific context, diagnostic reports, and vehicle information to help drivers better understand their vehicle's condition.

---

## Platform Preview

<div align="center">

<img src="./Tnabbah_concon/assets/hero-light.png" width="850" alt="TNABBAH Platform Preview" />

<br /><br />

<img src="./Tnabbah_concon/assets/obd-light.png" width="850" alt="TNABBAH OBD-II Vehicle Diagnostics" />

</div>

---

## Key Features

| Feature | Description |
|---|---|
| **Real-Time Monitoring** | Reads live vehicle data and continuously displays important vehicle metrics within the mobile application. |
| **OBD-II Bluetooth Communication** | Connects directly to the vehicle through an ELM327 BLE OBD-II adapter. |
| **Live OBD-II PID Processing** | Reads, decodes, and processes supported OBD-II parameters such as RPM, vehicle speed, temperatures, voltage, engine load, fuel information, and other supported vehicle readings. |
| **Fault Code Detection** | Reads Diagnostic Trouble Codes (DTCs) and organizes them for analysis and interpretation. |
| **Vehicle Identification** | Retrieves vehicle information such as VIN and Mode 09 data to associate diagnostic information with the correct vehicle. |
| **AI Vehicle Health Analysis** | Converts technical diagnostics and vehicle readings into clear and understandable health insights. |
| **Intelligent Assistant** | Allows drivers to ask questions and understand their vehicle condition using vehicle-specific context. |
| **Arabic & English Reports** | Generates simplified diagnostic information and reports in both Arabic and English. |
| **Smart Maintenance Wallet** | Organizes vehicle maintenance information and helps users keep track of maintenance-related records. |
| **Maintenance Recommendations** | Provides maintenance guidance based on vehicle condition and diagnostic information. |
| **Maintenance Reminders** | Supports proactive maintenance tracking, scheduling, and reminders. |
| **Notifications** | Provides application notifications for relevant vehicle and maintenance events. |
| **Diagnostic History** | Maintains vehicle-specific diagnostic reports and historical information. |
| **Multi-Vehicle Management** | Allows users to manage and monitor multiple vehicles while keeping their data separated. |
| **MQTT Live Telemetry** | Streams real-time vehicle readings through MQTT-based infrastructure. |
| **Cloud Synchronization** | Stores and synchronizes user, vehicle, report, maintenance, and application data using Supabase. |
| **Vehicle-Specific Data Separation** | Separates telemetry, diagnostics, reports, maintenance records, and assistant context for each user and vehicle. |

---

## Vehicle Diagnostics Flow

```text
Real Vehicle
     │
     ▼
ELM327 BLE OBD-II Adapter
     │
     ▼
Bluetooth Low Energy Communication
     │
     ▼
TNABBAH Mobile Application
     │
     ├── Vehicle Identification / VIN
     ├── Supported PID Discovery
     ├── Live OBD-II Data
     ├── Diagnostic Trouble Codes
     └── Vehicle State
     │
     ▼
MQTT Real-Time Telemetry
     │
     ▼
Backend & Diagnostics Services
     │
     ├── Diagnostic Processing
     ├── Vehicle Health Analysis
     ├── Maintenance Logic
     └── Intelligent Assistance
     │
     ▼
Supabase / PostgreSQL
     │
     ├── Users
     ├── Vehicles
     ├── Reports
     ├── Maintenance
     ├── Notifications
     └── Vehicle History
```

---

## System Architecture

```text
Vehicle
   │
   ▼
OBD-II Bluetooth Adapter
   │
   ▼
TNABBAH Mobile Application
   │
   ▼
MQTT Infrastructure
   │
   ▼
Diagnostics Engine
   │
   ▼
AI Analysis Layer
   │
   ▼
Supabase Cloud Services
```

---

## Technology Stack

### Mobile Application

- React Native
- Expo
- TypeScript
- Expo Router
- React Native BLE
- Expo Notifications
- Secure Storage

### Vehicle Communication

- OBD-II
- ELM327 BLE Adapter
- Bluetooth Low Energy (BLE)
- OBD-II PIDs
- Diagnostic Trouble Codes (DTCs)
- VIN / Mode 09 Vehicle Information

### Backend Services

- FastAPI
- Python
- Node.js
- Express.js
- REST APIs

### Real-Time Systems

- MQTT
- Mosquitto Broker
- WebSocket-based MQTT Communication
- Real-Time Vehicle Telemetry
- Supabase Realtime

### Data & Cloud Services

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Realtime
- Supabase Edge Functions
- Cloud Data Synchronization

### Artificial Intelligence

- DeepSeek AI
- OpenAI API
- OpenAI-compatible SDK
- Vehicle-Aware Conversational Assistance
- AI-Assisted Diagnostic Interpretation

### Infrastructure & Deployment

- Ubuntu VPS
- Contabo VPS
- PM2
- Mosquitto
- Vercel

---

## Real Vehicle Integration

<div align="center">

<img src="./Tnabbah_concon/assets/obd-dark.png" width="760" alt="TNABBAH Real Vehicle OBD-II Integration" />

</div>

TNABBAH was designed to communicate with **real vehicles**, not only simulated diagnostic data.

The vehicle communication layer handles:

- BLE device discovery and connection
- ELM327 communication
- OBD-II command execution
- Supported PID discovery
- Live sensor data retrieval
- Diagnostic Trouble Code retrieval
- VIN and Mode 09 information
- Vehicle connection state
- Real-time telemetry publishing
- Vehicle-specific data routing

This allows TNABBAH to bridge the gap between physical vehicle data and cloud-based diagnostic services.

---

## Real-Time Telemetry

TNABBAH uses **MQTT and Mosquitto** to move vehicle telemetry between the mobile application and backend services.

Vehicle telemetry can include readings such as:

- Engine RPM
- Vehicle speed
- Coolant temperature
- Engine oil temperature
- Control module voltage
- Engine load
- Fuel pressure
- Fuel level
- Intake air temperature
- Air flow information
- Throttle position
- Supported OBD-II parameters
- Diagnostic state
- Vehicle connection status

Telemetry is separated using user- and vehicle-specific context so multiple vehicles can be managed independently.

---

## Intelligent Vehicle Assistance

TNABBAH includes a vehicle-aware conversational assistant designed to make automotive information easier to understand.

The assistant can work with:

- Vehicle identity
- Current vehicle
- Diagnostic reports
- Vehicle health information
- Maintenance recommendations
- Live vehicle context
- User questions

Instead of exposing raw diagnostic structures, the assistant focuses on producing clear, driver-friendly explanations in **Arabic or English**.

---

## Smart Maintenance

TNABBAH extends beyond diagnostics by helping drivers track and understand vehicle maintenance.

The platform supports:

- Maintenance tracking
- Smart Maintenance Wallet
- Maintenance reminders
- Maintenance recommendations
- Vehicle-specific maintenance records
- Notifications
- Multi-vehicle maintenance separation

This allows diagnostic information to become part of a longer-term vehicle maintenance workflow instead of remaining as a one-time fault scan.

---

## Project Objectives

TNABBAH was developed to:

- Simplify vehicle diagnostics for everyday and non-technical drivers
- Provide direct access to real vehicle data
- Identify vehicle faults through OBD-II diagnostics
- Detect important changes in vehicle health
- Detect vehicle issues before they become critical
- Transform technical automotive readings into clear and understandable insights
- Support proactive maintenance decisions
- Improve driver awareness through AI-powered assistance
- Provide intelligent, vehicle-specific assistance
- Manage multiple vehicles within one platform
- Connect real-time vehicle telemetry with cloud-based diagnostic services
- Connect vehicle diagnostics, cloud infrastructure, and AI analysis within one integrated system

---

## What Makes TNABBAH Different?

TNABBAH is not designed as a simple fault-code reader.

The platform combines several layers of a complete vehicle diagnostics ecosystem:

**Vehicle communication → real-time telemetry → diagnostics → cloud storage → maintenance management → intelligent assistance.**

TNABBAH brings **real-time diagnostics**, **AI analysis**, **conversational assistance**, **maintenance tracking**, **multi-vehicle management**, and **cloud connectivity** together within one integrated platform.

Instead of presenting only technical OBD-II values or raw fault codes, TNABBAH focuses on transforming vehicle data into information that drivers can actually understand and use.

The platform explains what a detected issue means, why it matters, and what action the driver can take next.

The system was also validated using **physical ELM327 hardware and real vehicles**, allowing the project to test actual Bluetooth communication, OBD-II responses, vehicle telemetry, fault detection, and diagnostic workflows rather than relying only on simulated data.

---

## Project Visuals

<div align="center">

<img src="./Tnabbah_concon/assets/abstract-light.png" width="850" alt="TNABBAH Project Visual" />

<br /><br />

<img src="./Tnabbah_concon/assets/logo-word.png" width="420" alt="TNABBAH Wordmark" />

<br /><br />

<img src="./Tnabbah_concon/assets/logo-ar.png" width="420" alt="TNABBAH Arabic Logo" />

</div>

---

## Repository Scope

This repository contains the public version of the **TNABBAH graduation project**, including:

- Mobile application components
- Vehicle communication logic
- OBD-II and BLE integration
- Real-time telemetry components
- Diagnostic processing components
- Cloud and Supabase integrations
- Project documentation
- Demonstration media
- Selected project resources

Some production infrastructure and sensitive configuration are intentionally excluded from the public repository, including:

- Private environment variables
- API credentials and keys
- Server credentials
- Infrastructure secrets
- Private datasets
- Production configuration files

---

## Built With Purpose

TNABBAH was built to make vehicle diagnostics:

- **Smarter** through diagnostic analysis and AI-assisted interpretation
- **Clearer** through driver-friendly reports and explanations
- **Faster** through real-time vehicle monitoring
- **Connected** through MQTT and cloud infrastructure
- **More proactive** through maintenance recommendations and reminders
- **More practical** through maintenance tracking and multi-vehicle support
- **More intelligent** through vehicle-aware conversational assistance
- **More accessible** for everyday drivers

---

<div align="center">

<img src="./assets/tnabbah-footer.svg" alt="TNABBAH animated footer" width="100%" />

</div>