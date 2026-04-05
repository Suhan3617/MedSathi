# 🏥 MedSathi (AlgoMed) - The AI-Assisted Second Brain for Healthcare

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**MedSathi** is a comprehensive, next-generation telemedicine platform architected on the MERN stack. It is designed to bridge the critical gap between artificial intelligence and everyday clinical practice. By providing doctors with an "AI Second Brain" to reduce administrative burnout and empowering patients with an intelligent triage system, MedSathi reimagines the modern healthcare workflow.

---

## ✨ Core Platform Features

### 🤖 1. AI Symptom Checker & Smart Triage
At the heart of the patient experience is our conversational AI Triage Assistant.
* **Dynamic Interaction:** Powered by **Gemini 1.5 Flash**, the AI dynamically asks context-aware follow-up questions to deeply understand the patient's distress, moving beyond static questionnaires.
* **Auto-Routing:** The engine evaluates the symptoms in real-time and outputs a structured JSON triage report detailing the severity level, a clinical summary, and the recommended specialist (e.g., Neurologist, Cardiologist).
* **Seamless Handoff:** The system instantly redirects patients to the provider directory, automatically applying filters for the exact specialist recommended by the AI and sorting results by top-rated practitioners.

### ⚡ 2. Automated SOAP Notes for Providers
We drastically reduce the documentation burden on healthcare providers.
* **Clinical Assistant:** Acting as a passive clinical scribe, the AI analyzes consultation data and histories to instantly generate highly accurate **Subjective, Objective, Assessment, and Plan (SOAP)** notes.
* **Efficiency:** This feature is designed to save doctors hours of manual charting daily, allowing them to refocus entirely on patient care.

### 📹 3. Secure Telemedicine Suite
* **HD Consultations:** High-definition, low-latency video infrastructure for reliable virtual examinations.
* **Integrated Messaging:** Secure, real-time asynchronous chat for prescriptions, follow-ups, and quick patient-doctor queries.

### 📊 4. Interactive Patient Dashboard
* **Wellness Journey Tracking:** Beautiful, responsive visual activity charts (powered by Recharts) that map out patient consultation histories.
* **Dynamic Vitals Logging:** A sleek, interactive interface allowing patients to log daily vitals (Blood Pressure, Heart Rate, SpO2, Temperature) that instantly syncs with their secure backend profile.
* **Algorithmic Health Score:** The platform dynamically evaluates overall patient health based on BMI computations, logged vitals, and lifestyle metrics.

### 🎨 5. Premium UI / UX Architecture
* **Glassmorphism Design:** The interface utilizes modern, translucent UI elements with deep background blurs for a clinical yet premium feel.
* **Fluid Interactivity:** Powered by **Framer Motion**, the application features complex, butter-smooth animations, interactive modals, and dynamic floating background elements.
* **Universal Theming:** A fully integrated, persistent Dark/Light mode switcher that seamlessly transforms the entire application's aesthetic.

---

## 🛠️ Technical Architecture

### **Frontend Infrastructure**
* **React.js** (Bootstrapped with Vite for optimized, blazing-fast builds)
* **Tailwind CSS** (Utilized for highly customizable, responsive, utility-first styling)
* **Framer Motion** (Driving complex, state-based animations and layout transitions)
* **Recharts** (Handling complex data visualization on dashboards)
* **React Router DOM** (Managing secure, role-based SPA navigation)

### **Backend Infrastructure**
* **Node.js & Express.js** (Robust RESTful API architecture handling high-concurrency requests)
* **MongoDB & Mongoose** (NoSQL database and Object Data Modeling for flexible, scalable record management)
* **JWT (JSON Web Tokens)** (Implementing secure, stateless authentication and authorization flows)

### **AI & Cloud Integrations**
* **Google Gemini API (1.5 Flash):** The core intelligence engine driving both the conversational AI Symptom Checker and the Automated SOAP Notes generation.
* **Cloudinary:** Integrated for secure, optimized, and scalable cloud storage of user avatars, sensitive medical documents, and prescription uploads.
* **Firebase:** Leveraged for enhanced real-time capabilities, supplementary authentication flows, and reliable cloud messaging infrastructure.

---

## 📂 System Structure

```text
MedSathi/
├── Backend/
│   ├── controllers/      # Business logic (aiController, authController, appointmentController)
│   ├── models/           # Mongoose schemas (Patient, Doctor, Appointment, Vitals)
│   ├── routes/           # Express API endpoints
│   ├── utils/            # Helper functions (Gemini config, Cloudinary setup, Middleware)
│   └── server.js         # Core entry point and middleware configuration
└── Frontend/
    ├── src/
    │   ├── assets/       # Static assets, images, and SVGs
    │   ├── components/   # Reusable UI components (Navbar, Sidebar, Interactive Modals)
    │   ├── context/      # React Context providers (AuthContext, ThemeContext)
    │   ├── pages/        # Main application views (Dashboard, SymptomChecker, FindDoctors)
    │   ├── services/     # Axios API call configurations and interceptors
    │   └── App.jsx       # Main application routing and auth guards
    ├── tailwind.config.js
    └── vite.config.js