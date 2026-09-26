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

<br />

**Click the image above to watch the full TNABBAH demonstration**

</div>

---

## About TNABBAH

**TNABBAH** is a smart vehicle diagnostics and maintenance platform that combines **OBD-II Bluetooth communication**, real-time vehicle monitoring, cloud infrastructure, and artificial intelligence to make automotive diagnostics easier to understand and more useful for everyday drivers.

The platform connects to real vehicles through an **ELM327 BLE OBD-II adapter**, reads live vehicle data, retrieves diagnostic trouble codes, identifies vehicle information, monitors vehicle health, and transforms technical automotive information into clear reports, maintenance guidance, and practical recommendations.

Instead of showing drivers raw diagnostic codes and sensor values alone, TNABBAH explains what a detected issue means, why it matters, how it may affect the vehicle, and what action can be taken next.

TNABBAH also provides an intelligent, vehicle-aware assistant that helps users understand their vehicle condition using diagnostic reports, vehicle information, maintenance data, and relevant vehicle context.

The platform was designed as an integrated system connecting the physical vehicle to mobile software, real-time communication infrastructure, backend diagnostic services, cloud data services, and AI-assisted interpretation.

---

## Key Features

| Feature | Description |
|---|---|
| **Real-Time Monitoring** | Reads and monitors live vehicle data and displays important metrics directly in the mobile application. |
| **OBD-II Bluetooth Communication** | Connects directly to real vehicles through an ELM327 BLE OBD-II adapter. |
| **Live OBD-II PID Processing** | Reads and interprets supported OBD-II parameters including RPM, speed, temperatures, engine load, voltage, fuel-related readings, and other supported vehicle data. |
| **Fault Code Detection** | Reads Diagnostic Trouble Codes (DTCs) and prepares them for diagnostic analysis and interpretation. |
| **Vehicle Identification** | Retrieves vehicle information such as VIN and Mode 09 data to associate diagnostics with the correct vehicle. |
| **AI Vehicle Health Analysis** | Converts technical diagnostic information and vehicle readings into clear and understandable insights. |
| **Intelligent Assistant** | Allows drivers to ask questions and understand their vehicle condition through vehicle-aware conversational assistance. |
| **Arabic & English Reports** | Provides simplified diagnostic information and reports in both Arabic and English. |
| **Smart Maintenance Wallet** | Organizes vehicle maintenance information, records, recommendations, and related maintenance data. |
| **Maintenance Recommendations** | Provides practical maintenance guidance based on vehicle condition and diagnostic information. |
| **Maintenance Reminders** | Supports proactive maintenance tracking, scheduling, and reminders. |
| **Notifications** | Delivers relevant application notifications related to vehicle and maintenance events. |
| **Diagnostic History** | Maintains vehicle-specific diagnostic reports and historical information for later reference. |
| **Multi-Vehicle Management** | Allows users to manage and monitor multiple vehicles from one account while keeping each vehicle's information separated. |
| **MQTT Live Telemetry** | Streams real-time vehicle readings through MQTT-based infrastructure for continuous data communication. |
| **Cloud Synchronization** | Stores and synchronizes user, vehicle, report, maintenance, and application data using Supabase and PostgreSQL. |
| **Vehicle-Specific Data Management** | Separates telemetry, diagnostics, reports, maintenance records, and assistant context for each vehicle. |

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

The platform explains what a detected issue means, why it matters, how serious it may be, and what action the driver can take next.

The system was also validated using **physical ELM327 hardware and real vehicles**, allowing the project to test actual Bluetooth communication, OBD-II responses, live vehicle telemetry, fault detection, and diagnostic workflows rather than relying only on simulated data.

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