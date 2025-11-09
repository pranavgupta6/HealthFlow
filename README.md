# 🏥 HealthFlow  
### Team Name:- LowGang  
**Theme:** HealthTech Innovation  
**Project Name:** HealthFlow  
**Project Link:** [https://medi-connect-1bea7b68.base44.app](https://medi-connect-1bea7b68.base44.app)  
**Presentation Link:** [https://drive.google.com/file/d/1zE_oOsjLEhxq4fKlpIjR1o1cZCQph-Cj/view](https://drive.google.com/file/d/1zE_oOsjLEhxq4fKlpIjR1o1cZCQph-Cj/view)

---

## 👥 Team Details

| Name | Role | Email | Phone | LinkedIn |
|------|------|--------|--------|-----------|
| [**Meet Batra**](https://github.com/meetbatra) (Leader) | Full Stack Developer | [meetbatra56@gmail.com](mailto:meetbatra56@gmail.com) | +91 8287440951 | [LinkedIn](https://www.linkedin.com/in/meet-batra-25612b260) |
| [**Shashwat Tiwari**](https://github.com/Shashwat1306) | Developer | [Shashwat132004@gmail.com](mailto:Shashwat132004@gmail.com) | +91 8076217105 | [LinkedIn](https://www.linkedin.com/in/shashwat-tiwari-504a41298) |
| [**Lakshya Chhabra**](https://github.com/LAKSHYAA005) | Developer | [lakshyachhabra.2005@gmail.com](mailto:lakshyachhabra.2005@gmail.com) | +91 9354880025 | [LinkedIn](https://www.linkedin.com/in/lakshya-chhabra-1b6117263) |
| [**Pranav Gupta**](https://github.com/pranavgupta6) | Developer | [gpranav859@gmail.com](mailto:gpranav859@gmail.com) | +91 9315220563 | [LinkedIn](https://www.linkedin.com/in/pranavgupta6) |

---

## 💡 Overview

**HealthFlow** is a hospital management and real-time patient flow system designed to optimize outpatient departments (OPDs), appointment scheduling, and bed availability across hospitals. It provides seamless interaction between hospital administrators, doctors, receptionists, pharmacists, and patients through a single, unified platform. Built for scalability, HealthFlow integrates **real-time queue updates, custom bed management, and automated shift-based token allocation**, all synchronized through **Socket.io** for instant dashboard updates.

---

## 🏗️ Key Features

### 👨‍⚕️ Doctor’s Dashboard
- **First Login Setup:** When a doctor logs in for the first time, they configure their **forenoon and afternoon shifts**, specifying start and end timings and defining **maximum patient capacity** per shift.  
- **Shift Check-In:** Upon check-in for a shift, all patients registered for that shift are automatically marked as **“waiting”**, making them visible in the queue.
- **Consultation Workflow:** During a session, the doctor marks a patient as **“in-progress”**, fills out a **digital prescription form** with symptoms, diagnosis, and dynamic medicine entries (name + dosage), and then marks the consultation as **“completed.”**
- **Post-Consultation Records:** Completed patients remain stored in the backend for future reference and analytics but are hidden from the live queue frontend for a clutter-free interface.

### 🏥 Receptionist’s Dashboard
- **Patient Registration:** Allows the receptionist to register **walk-in patients** with complete demographic and medical details such as name, age, height, weight, gender, blood group, date of birth, and allergies.  
- **Token Management:** The receptionist assigns patients to a doctor and shift. The system automatically checks the doctor’s **shift timing** and **available capacity** before issuing a token, ensuring no overbooking.
- **Bed Booking Module:** The receptionist can book beds based on **custom categories** defined by the hospital admin (e.g., General Ward, Private Room, ICU, etc.).  
- **Live Availability:** Bed availability data is updated in real-time, ensuring synchronization between hospital staff and users.  
- **Instant Dashboard Updates:** Any new patient registration or bed booking instantly reflects on all relevant dashboards without requiring page reloads.

### 🧑‍💼 Admin Dashboard
- **Hospital Registration:** The admin registers a hospital with complete details such as name, address, contact info, and website.  
- **Custom Domain System:** Each hospital uses a **unique custom domain** (e.g., `@cityhospital.in`) that links all staff accounts under the same hospital.  
- **Staff Management:** Admins can add **doctors and receptionists** using their hospital domain emails.  
- **Custom Bed Categories:** Admins define **bed types and total counts** based on hospital infrastructure; these automatically appear in the receptionist’s booking module.  
- **Data Isolation:** All hospital data — doctors, patients, beds, and appointments — is isolated based on the hospital’s domain.

### 👩‍⚕️ Pharmacist’s Dashboard *(Future Integration)*
- Manage inventory of medicines and consumables.  
- Track batch numbers, expiry dates, and stock levels.  
- Issue prescriptions directly linked to the doctor’s submitted records.

### 👤 Patient Portal
- **Browse Hospitals:** Patients can view all registered hospitals displayed as cards, showing hospital info and live bed availability.  
- **Appointment Booking:** Patients can book appointments directly via the hospital’s page; the system auto-assigns tokens based on the doctor’s shift capacity.  
- **Prescription Records:** After consultation, patients can access their digital prescriptions under their personal dashboard.  

---

## ⚙️ Combined Workflow (Doctor + Receptionist)
1. **Admin adds a new doctor** with email and password only.  
2. **Doctor’s first login** → sets shift timings and max patient count for both forenoon and afternoon shifts.  
3. **Receptionist registers patients** → assigns doctor and shift, and system issues tokens automatically within limits.  
4. **Doctor checks in** → all assigned patients’ statuses automatically switch to **“waiting.”**  
5. **Doctor begins consultation** → marks a patient as **“in-progress”** and fills the prescription form.  
6. **After consultation** → patient’s status becomes **“completed,”** remaining stored for records but hidden from the live queue.  
7. **Receptionist books beds** as needed from available categories, updated instantly across the system.  
8. All updates — token assignments, queue changes, check-ins, and bed bookings — are **broadcast in real time** to all relevant dashboards through **Socket.io**.  

This coordinated workflow ensures smooth communication, zero redundancy, and complete transparency between hospital staff and patients.

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | Base44 Built-in |
| **Authentication** | Base44 Authentication |
| **Deployment** | Base44 |
| **UI Design Inspiration** | [Koyeb](https://www.koyeb.com) – Clean, modern, light SaaS UI |

---

## 🔄 Real-Time Features
- Live synchronization of queues, bed status, and appointments via **Socket.io**.  
- Automatic shift detection and token allocation.  
- Auto-update of dashboards when a doctor checks in, a patient registers, or a bed is booked.  

---

## 🚀 Future Enhancements
- Role-based analytics dashboard for admins (bed occupancy, patient trends, doctor efficiency).  
- E-prescription integration with pharmacy APIs.  
- SMS/Email notifications for appointment confirmations.  
- AI-based patient load prediction per shift.  
- **Emergency Response Integration:** An **Emergency Button** feature will be added, which — when clicked — will automatically detect the patient’s location and **notify the nearest hospital for an ambulance dispatch** using a **Maps API** (such as Google Maps or Mapbox). This will allow real-time routing and emergency prioritization within the hospital network.  

---

## 🧾 Summary
**HealthFlow** provides an end-to-end hospital management solution that connects patients, doctors, and hospital staff in real time. With customizable shift scheduling, token automation, live bed management, and digital prescriptions, it transforms how hospitals handle OPDs and inpatient flow — making healthcare smarter, faster, and more efficient.

---

**Developed with ❤️ by Team LowGang**
