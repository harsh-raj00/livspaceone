# ⚜️ LivspaceOne

<div align="center">
  <img src="frontend/img/about_hero_ultimate.png" alt="LivspaceOne Cover" width="100%" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
  <br /><br />

  <h3>📐 Next-Generation Luxury Architecture, Interior Design & LuxeBuild Materials Ecosystem</h3>
  <p><strong>India's premier digital storefront for sophisticated space creation and professional execution.</strong></p>

  <p>
    <a href="https://livspaceone.onrender.com" target="_blank">
      <img src="https://img.shields.io/badge/Live_Application-🔗-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
    <img src="https://img.shields.io/badge/Vanilla_CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  </p>
</div>

---

## 📖 Table of Contents
1. [🌟 Executive Overview](#-executive-overview)
2. [💎 Core Pillars & Features](#-core-pillars--features)
3. [🏗️ Technical Architecture](#%EF%B8%8F-technical-architecture)
4. [⚡ Getting Started (Local Development)](#-getting-started-local-development)
5. [📦 Database Management & Seeding](#-database-management--seeding)
6. [☁️ Render Cloud Deployment](#%EF%B8%8F-render-cloud-deployment)
7. [💤 Render Sleep & Wake-up Guide (CRITICAL)](#-render-sleep--wake-up-guide-critical)
8. [🤝 Leadership Team](#-leadership-team)

---

## 🌟 Executive Overview

**LivspaceOne** is an ultra-premium, high-contrast, light-mode architecture-tech platform designed to seamlessly connect luxury homeowners with India's elite certified contractors, architects, and design experts. 

Built with performance, responsiveness, and aesthetic minimalism in mind, LivspaceOne features a dual-system architecture:
* **The LuxeBuild Mart**: A highly tailored e-commerce interface for high-grade electrical, plumbing, painting, and construction materials.
* **The Design Studio**: A interactive workspace allowing clients to hire, schedule, and live-track elite service professionals.

---

## 💎 Core Pillars & Features

| Pillar | Features | Tech Stack |
| :--- | :--- | :--- |
| **LuxeBuild Mart** | Complete cart, checkout flow, structural material catalog, product filters | `MongoDB`, `Mongoose`, `Vanilla JS` |
| **Design Studio** | Verified professional profiles, direct scheduling, availability states | `Socket.io`, `Express API` |
| **Interactive UX** | Lightbox portfolio viewing, custom bento grid workflow panels, high-contrast aesthetics | `Custom CSS3`, `Vanilla JS` |
| **Operations (CMS)** | Full admin panel, active catalog updater, dynamically controllable sliders | `JWT Auth`, `Bcrypt`, `REST APIs` |
| **Smart Concierge** | Embedded intelligent support chatbot for immediate local and route queries | `Natural Language Regex` |

---

## 🏗️ Technical Architecture

LivspaceOne is engineered using a decoupled, highly responsive client-server model:

```mermaid
graph TD
    subgraph Client-Side [Premium Light-Mode UI]
        index[index.html - Cinematic Home]
        about[about.html - Bento-Grid About]
        mart[mart.html - E-Commerce Materials]
        admin[admin.html - Operations Control Center]
    end

    subgraph REST-API [Express Server Layer]
        auth[JWT Auth & Encryption Middleware]
        slides[Slides & Lightbox REST APIs]
        products[Products & Categories API]
        workers[Live-Status Worker API]
    end

    subgraph Persistence [Dynamic Database Engine]
        atlas[(MongoDB Atlas - Cloud)]
        memory[(In-Memory MongoDB Server)]
    end

    Client-Side <-->|HTTP REST / WebSockets| REST-API
    REST-API -->|Default / Environment| atlas
    REST-API -.->|Debian 12-Compatible Local Fallback v7.0.5| memory
```

---

## ⚡ Getting Started (Local Development)

Follow these instructions to boot the local environment on your machine:

### 1. Repository Setup
```bash
git clone https://github.com/harsh-raj00/livspaceone.git
cd livspaceone/backend
npm install
```

### 2. Environment Variables Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/livspaceone
JWT_SECRET=livspaceone_secure_jwt_key_2026_production_x9k2m
ALLOWED_ORIGINS=*
NODE_ENV=development
```

### 3. Launch the Server
Start the local server instance:
```bash
node server.js
```
Visit the application at:
* 🌐 **Main Client**: `http://localhost:3000`
* 🛠️ **REST API Endpoints**: `http://localhost:3000/api`

---


## 🤝 Leadership Team For Fun

Our elite operations and engineering vectors are steered by legendary visionaries:

* 🏏 **Sachin Tendulkar** — *Founder & CEO* (Strategic scaling & leadership)
* 📐 **Rohit Sharma** — *Chief Architect* (Master structural planning)
* 🎨 **MS Dhoni** — *Head of Design* (Unrivaled, serene conceptual spaces)
* ⚡ **Virat Kohli** — *VP of Operations* (Peak execution, speed, & delivery)

---

<div align="center">
  <b>Designed with ❤️ by Harsh Raj</b>
</div>
