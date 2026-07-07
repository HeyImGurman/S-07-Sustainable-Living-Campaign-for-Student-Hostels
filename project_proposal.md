# Smart Hostel Energy Management System: Project Proposal

## Introduction
Electricity consumption is a significant operational expense in educational institutions, particularly in hostel settings where communal living often leads to the unnecessary operation of appliances like lights and fans. Traditional manual monitoring methods are often inefficient or impractical for multi-occupancy environments, while mobile-tracking solutions present privacy concerns and reliability issues. 

The **Smart Hostel Energy Management System** is proposed as an IoT-inspired solution designed to minimize human intervention through automated occupancy detection and intelligent appliance management. This project focuses on developing a software simulation prototype that demonstrates the system's full functionality, establishing a scalable architecture for future hardware deployment.

---

## Problem Statement
Hostel rooms, which typically accommodate four to five students, face persistent issues with electricity wastage due to appliances being left on in empty rooms. The consequences include:
* Significant electricity wastage and increased institutional costs.
* Higher carbon emissions[cite: 16].
* Difficulties in manually supervising hundreds of rooms and a lack of centralized occupancy monitoring.

---

## Proposed Solution & Objectives
The system utilizes **ESP32 microcontrollers**, **mmWave human presence sensors**, and **relay modules** to automate electricity management without requiring mobile devices or wearables. 

### Primary Objectives:
* Reduce electricity consumption through intelligent, occupancy-based automation.
* Develop a modern, responsive dashboard for real-time monitoring and remote control.
* Simulate IoT communication and visualize energy savings/analytics without requiring physical hardware.
* Create a scalable architecture for future hardware integration.

---

## Project Scope
### In Scope (Simulation Prototype):
* Simulation of multiple hostel rooms and occupancy using generated data.
* Real-time monitoring dashboard with role-based access for students and administrators.
* Remote appliance switching (lights/fans) and automatic shutdown.
* Energy consumption analytics, historical logs, and a notification system.

### Out of Scope:
* Physical hardware components (ESP32 programming, sensors, relay operation, or wiring).
* Mobile application development, cloud deployment, and production-grade infrastructure.

---

## Stakeholders & Benefits
| Stakeholder | Key Responsibilities | Primary Benefits |
| :--- | :--- | :--- |
| **Hostel Students** | Monitor status, switch appliances, view stats | Convenience, reduced waste |
| **Administration** | Monitor rooms, analyze usage, generate reports | Cost reduction, resource management  |
| **Maintenance** | Monitor relays, detect sensor/room failures | Faster response, less effort |
| **Institution** | N/A | ]Sustainability, smart campus development  |

---

## System Architecture (Hardware & Software)
### Hardware Architecture (Future Deployment)
* **ESP32 Board:** Dual-core, Wi-Fi enabled controller for sensor data and relay logic.
* **mmWave Sensors (LD2410/C1001):** High-precision detection of stationary and moving humans.
* **Relay Module:** Electronic switch to control appliance power.

### Software Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, and React Router.
* **Backend (Simulation):** Node.js and Express.js.
* **Database:** PostgreSQL, SQLite, or Firebase Firestore.
* **Data Visualization:** Recharts.

---

## Key Features
* **Real-Time Dashboard:** Displays occupancy status, energy usage, and active alerts.
* **Automated Control:** Automatic light/fan shutdown with configurable timers and manual overrides.
* **Energy Analytics:** Tracks usage, estimates savings, and calculates $CO_2$ emission reductions.
* **Activity Logs:** Full records of occupancy changes and user actions.

---

## Conclusion
The Smart Hostel Energy Management System offers a scalable, intelligent approach to energy sustainability in campus infrastructure.While the current project utilizes software simulation, the architecture is designed to transition seamlessly to a fully functional IoT system, significantly improving energy efficiency and operational management.