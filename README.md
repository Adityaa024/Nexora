<div align="center">
  
# 🏥 NEXORA
**Next-Generation Patient Flow Intelligence**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

*An intelligent, AI-driven Queue Management System designed to modernize hospital waiting rooms, prioritize patient care, and streamline clinic operations.*

</div>

<br />

## 🌟 Overview

**NEXORA** is a full-stack health-tech application that replaces traditional, frustrating hospital queues with an intelligent, dynamic triage system. By leveraging **Google's Gemini AI**, the system automatically analyzes a patient's symptoms upon check-in and assigns a priority score (Standard, Urgent, or Critical). 

Patients are dynamically ordered in a live "Smart Queue" that updates in real-time, ensuring those who need immediate care receive it first, while keeping all patients informed of their exact wait time via a beautifully designed dashboard.

---

## ✨ Comprehensive Feature List

### 👨‍⚕️ Admin & Hospital Management
- **Intelligent Hospital Control Center:** A state-of-the-art dashboard giving doctors and admins a birds-eye view of all ongoing clinical sessions.
- **Smart Queue Algorithm:** Discards the outdated "first-come, first-serve" model. Patients are dynamically reordered in the queue based on an AI-calculated medical severity score.
- **AI Triage Emergency Alerts:** Instantly detects critical keywords in patient symptoms (e.g., "chest pain") and flashes full-screen red emergency alerts for immediate triage.
- **QR Check-in Scanner:** A built-in camera module that allows receptionists to scan patient QR codes for instant, contactless walk-in registration.
- **Appointment Scheduling Engine:** Full calendar integration allowing staff to manage upcoming bookings and track daily patient load.
- **One-Click Session Management:** Streamlined clinical workflow buttons to "Call Next Patient", "Mark Completed", or "End Session".
- **Global Patient Directory:** A searchable database of all registered patients, their contact info, and their lifetime visitation history.

### 🤒 Patient Experience
- **Beautiful Personal Dashboard:** A gorgeous, glassmorphism-styled UI where patients can view their active status.
- **Live Wait-Time Predictions:** Patients see an exact, live-updating countdown (in minutes) of when they will see the doctor, eliminating waiting room anxiety.
- **Real-Time WebSocket Sync:** The second a doctor calls a patient, the patient's screen instantly flashes "IT'S YOUR TURN!" without them ever needing to refresh the page.
- **Conversational AI Symptom Checker:** Patients type their symptoms naturally. Google Gemini AI processes this, generates a clinical summary, and assigns a precise priority score.
- **Medical History Vault:** Patients can log in to view their past visits, doctor notes, and health trajectory.
- **Seamless & Secure Login:** Features Google OAuth One-Tap sign-in alongside traditional Email/Password authentication via Firebase Security.

### 🧠 Under The Hood (Technical Features)
- **Google Gemini Integration:** Complex prompt engineering ensures the AI outputs strictly formatted JSON risk assessments based on medical data.
- **Socket.io Event Broadcasting:** A high-performance WebSocket architecture handling live queue updates to hundreds of connected clients simultaneously.
- **Dynamic Routing & Middleware:** Secure Next.js App Router setup protecting admin routes from unauthorized access.
- **Fully Responsive Design:** The entire platform is meticulously styled with Tailwind CSS to look pixel-perfect on 4K monitors, tablets, and small mobile phones.

## 🛠️ Technology Stack

NEXORA is built on a modern, robust JavaScript stack:

### **Frontend**
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** Zustand
- **Notifications:** Sonner (Toast)

### **Backend**
- **Environment:** Node.js
- **Framework:** Express.js (TypeScript)
- **Database:** MongoDB & Mongoose
- **AI Integration:** `@google/generative-ai` (Gemini 1.5)
- **Authentication:** JWT (JSON Web Tokens) & Firebase Admin
- **Real-time:** Socket.IO / HTTP Polling

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18+) and **MongoDB** installed on your machine. You will also need a **Google Gemini API Key** and a **Firebase Project** for authentication.

### 1. Clone & Setup
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend (`backend/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
# ...other firebase config
```

### 3. Run the Application

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🌍 Deployment Guide

Deploying NEXORA involves hosting the backend (Node.js/Express) and the frontend (Next.js) separately.

### 1. Database (MongoDB Atlas)
Your database is likely already hosted on MongoDB Atlas. Ensure your **Network Access** settings in Atlas allow connections from anywhere (`0.0.0.0/0`) so your deployed backend can reach it securely.

### 2. Backend Deployment (Vercel)
We have configured the Express backend to run natively as a Serverless Function on Vercel.
1. Create a new project on Vercel and import your GitHub repository.
2. Set the **Root Directory** to `backend`.
3. Vercel will automatically detect the `vercel.json` routing rules and the `api/index.ts` entry point.
4. **Environment Variables**: Add your backend keys (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`).
5. Click **Deploy**. Vercel will give you a live API URL (e.g., `https://nexora-backend.vercel.app`).
*(Note: Because Vercel is serverless, WebSockets/Socket.IO are disabled in production, but the system gracefully falls back to 3-second HTTP polling).*

### 3. Frontend Deployment (Vercel)
We highly recommend [Vercel](https://vercel.com/) for hosting Next.js applications.
1. Create a new project on Vercel and import your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. Vercel will automatically detect Next.js and set the build command to `npm run build`.
4. **Environment Variables**: Add your Firebase keys. 
5. **Important**: Update any hardcoded `http://localhost:5000` API calls in your frontend code to use your new live backend URL (e.g., replace with `process.env.NEXT_PUBLIC_API_URL` and set that variable in Vercel to your backend URL).
6. Click **Deploy**.

---

## 🔐 Default Admin Access
To access the hospital control center, log in with the default admin credentials:
- **Email:** `admin@admin.com`
- **Password:** `admin`

*(Note: In a production environment, ensure you change these credentials and implement strict RBAC).*

---

<div align="center">
  <p>Built with ❤️ to revolutionize patient flow intelligence.</p>
</div>
