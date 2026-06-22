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

## ✨ Key Features

### 👨‍⚕️ For Administrators & Staff
- **Live Control Room:** A real-time, interactive dashboard displaying active tokens, waiting patients, and predicted wait times.
- **AI Triage Alerts:** Instantly flags critical patients with flashing red banners and immediate call-to-action buttons.
- **Smart Queue Management:** Automatically sorts patients by AI-calculated risk level rather than first-come-first-serve.
- **Quick Add Patient:** A rapid-entry module for receptionists to instantly register walk-ins and assign live tokens.
- **Session Control:** 1-click tools to Call Next Patient and End Consultations.

### 🤒 For Patients
- **Seamless Authentication:** Secure Google Sign-In and standard email/password authentication.
- **Live Token Tracking:** A stunning, live-updating dashboard showing the patient's token number, current status, and real-time wait estimation.
- **AI Symptom Analysis:** Patients type their symptoms naturally; the AI translates this into a clinical summary and risk score.
- **Medical History:** A complete, secure log of all past visits and AI-generated health plans.

---

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
