# 💊 MEDICARE V2.0 — Online Pharmacy & Healthcare E-Commerce Platform

[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.4-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-v4.19-brightgreen.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.15-indigo.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-teal.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

**MEDICARE V2.0** is a modern, enterprise-grade online pharmacy, prescription management, and pharmaceutical e-commerce platform built with React 18, TypeScript, Tailwind CSS, Express.js, and Prisma ORM.

---

## 🌟 Key V2.0 Features & Role Portals

### 👤 Customer E-Commerce Portal
- **Medicine Catalog**: Filterable catalog with departments (Pain Relief, Immunity, Diabetes, Heart Care, Cold & Flu, Medical Devices).
- **Smart Search & Voice Search**: Search by brand, composition, or dosage form; voice search modal for accessibility.
- **Cart & Discount Coupons**: Multi-item cart with server-validated prices, free delivery threshold (`> ₹499`), and coupon system (`MEDICARE10`, `WELCOME50`).
- **Multi-Step Checkout**: Address selection, prescription validation, payment options (COD, UPI, Credit Card).
- **Visual Order Timeline**: Live tracking steps (*Order Placed -> Packed -> Out For Delivery -> Delivered*).
- **Rx Prescription Upload**: Doctor prescription file upload for pharmacist approval.

### 🏪 Vendor / Seller Portal
- **Seller Dashboard**: Live sales analytics, total revenue metrics, low stock alerts.
- **Product Management**: Register new pharmaceutical drugs with composition, dosage form, MRP, and initial stock.
- **FEFO Batch Inventory**: First-Expire-First-Out stock batch tracking with one-click restocking.

### ⚕️ Pharmacist Verification Portal
- **Prescription Queue**: Real-time queue for uploaded customer doctor prescriptions.
- **Verification Workflow**: Review uploaded prescription files, approve or reject with clinical notes.

### 🛡️ Admin & Governance Console
- **Platform Analytics**: Total platform revenue, user growth, seller metrics.
- **User Governance**: Inspect and manage accounts across all system roles.

### 🤖 MediAssist AI Assistant
- **Educational Pharmacy Guidance**: Embedded AI helper drawer for non-prescriptive medical guidance, dosage instructions, and store navigation.

---

## 🛠️ Architecture & Tech Stack

```
Pharmacy-Drug-Management-System/
├── client/                     # React 18 + TypeScript + Vite + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MobileNav, MediAssist, VoiceSearch, OrderTimeline
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   ├── pages/              # Public, Customer, Seller, Pharmacist, Admin pages
│   │   ├── services/           # API fetch wrapper
│   │   └── types/              # TypeScript interfaces
├── server/                     # Node.js + Express + TypeScript + Prisma ORM
│   ├── prisma/                 # 20+ normalized database entities
│   └── src/
│       ├── controllers/        # Auth, Product, Cart, Order, Rx, Inventory, Seller, Admin
│       ├── middleware/         # Auth, Role-based RBAC, Error Handling
│       └── routes/             # REST API v1 endpoints
├── docker-compose.yml          # Docker orchestration
└── .github/workflows/ci.yml   # CI/CD Pipeline
```

---

## 🚀 Quick Start & Local Running

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### 1. Start Backend REST API Server
```bash
cd server
npm install
npx prisma db push
npx tsx src/db/seed.ts
npm run dev
```
*Backend runs on `http://localhost:5000/api/v1`*

### 2. Start Frontend React Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Demo Test Credentials

| Role | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `john.doe@medicare.com` | `pass123` | Buy medicines, Cart, Checkout, Order Tracking |
| **Seller** | `apex.pharma@medicare.com` | `pass123` | Manage products, FEFO inventory, Restock |
| **Pharmacist** | `pharmacist@medicare.com` | `pass123` | Verify Rx uploads, Approve/Reject prescriptions |
| **Admin** | `admin@medicare.com` | `admin123` | Platform analytics, User governance |

---

## 🐳 Docker Deployment

Run the full stack (PostgreSQL + Express + Nginx React Frontend) with a single command:
```bash
docker-compose up --build -d
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
