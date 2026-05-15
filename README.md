<div align="center">
  
  <h1> Livspaceone Platform</h1>
  <p><strong>India's Premium Construction Services & E-Commerce Hub</strong></p>
  <p><a href="https://livspaceone.onrender.com" target="_blank">🔗 Live Website</a></p>
  
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  </p>
</div>

---

## 🌟 About The Project

Workers is a state-of-the-art, full-stack marketplace designed to bridge the gap between users and verified construction professionals (plumbers, electricians, carpenters, etc.). Additionally, it serves as a comprehensive e-commerce hub for purchasing premium construction and interior materials. Built with performance and user experience in mind, Workers offers a seamless, real-time ecosystem.

## ✨ Core Features

* 🛒 **Integrated E-Commerce**: A full-fledged mart for browsing and purchasing construction materials with cart and checkout functionalities.
* 👨‍🔧 **Service Professional Booking**: Instantly browse, filter, and book verified professionals based on experience, rating, and availability.
* ⚡ **Real-Time WebSocket Updates**: Live tracking of worker availability and order statuses powered by Socket.io.
* 🎛️ **Powerful Admin Dashboard**: A secure CMS for managing products, workers, categories, and dynamic homepage sliders.
* 🤖 **Smart Customer Support**: Built-in chatbot interface to assist users instantly.
* 🔒 **Enterprise-Grade Security**: Robust JWT-based authentication with bcrypt password hashing.
* 📱 **Flawless Responsive Design**: A premium, mobile-first UI constructed with Tailwind CSS.

## 📁 System Architecture

```text
Livespaceone/
├── frontend/             # Client-Side Application (HTML, JS, Tailwind)
│   ├── components/       # Reusable UI (Modals, Navbar, Footer)
│   ├── css/ & img/       # Styling and Premium Image Assets
│   └── js/               # Application Logic & API Handlers
├── backend/              # Node.js REST API Server
│   ├── models/           # Mongoose Database Schemas
│   ├── middleware/       # JWT Auth & Security Handlers
│   ├── server.js         # Core Express App & Socket.io Initialization
│   └── seed_atlas.js     # MongoDB Database Population Script
└── package.json          # Server Dependencies
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites
* **Node.js** (v16.0.0 or higher recommended)
* **MongoDB Atlas** account (or a local MongoDB instance)
* Git

### 2. Installation
Clone the repository and install the backend dependencies:
```bash
git clone https://github.com/harsh-raj00/livspaceone.git
cd Livspaceone/backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory and configure your environment variables:
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
ALLOWED_ORIGINS=*



### 4. Database Seeding
To instantly populate your Atlas database with premium demo data (products, workers, dynamic slides):
```bash
cd backend
node seed_atlas.js
```

### 5. Launch the Platform
Start the core server:
```bash
cd backend
node server.js
```
* **Backend API**: `http://localhost:3000/api`
* **Frontend Application**: `http://localhost:3000`

> 💡 **Resilient Database Architecture**: The platform is designed with a smart fallback mechanism. If the `MONGO_URI` is invalid or Atlas is unreachable, the server autonomously spins up an **In-Memory MongoDB server** using `mongodb-memory-server` to ensure uninterrupted development.

---

<br />

<div align="center">
  <b>Made with ❤️ by Harsh Raj</b>
</div>
