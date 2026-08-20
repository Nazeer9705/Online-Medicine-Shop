# 💊 Pharmacy & Drug Management System

[![Node.js](https://img.shields.io/badge/Node.js-v22.x-brightgreen.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21-blue.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-v3.x-orange.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

A full-featured **Pharmacy & Drug Management Web Application** designed for seamless pharmaceutical inventory control, customer drug purchasing, and vendor sales tracking.

The system features dual role-based access for **Customers** and **Vendors (Sellers)**, supported by a robust backend database, inventory auto-deduction triggers, and interactive dashboards.

---

## 🌟 Key Features

### 👤 Customer Portal
- **User Authentication**: Secure registration and login system.
- **Product Catalog**: Browse available pharmaceutical products with live stock status, prices, manufacturer details, and expiration dates.
- **Instant Ordering**: Select medicine quantities and place orders with real-time total price calculation.
- **Order History**: Track past order details including Order ID, timestamp, quantity, and total cost.

### 🏪 Vendor / Seller Portal
- **Vendor Dashboard**: Personal seller profile with store location and contact details.
- **Add New Products**: Introduce new drugs into the global pharmacy registry with batch IDs, manufacturing & expiration dates, and unit pricing.
- **Stock Management & Restocking**: Monitor live inventory levels for all managed drugs and add stock on the fly.
- **Sales & Order Tracking**: View customer orders placed for vendor products in real time.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run in the main project root folder:
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open in Browser
Visit `http://localhost:3000`

---

## 🔑 Demo Credentials

| Role | User ID | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `cust123` | `pass123` | Browse Drugs, Buy Products, View Order History |
| **Vendor** | `seller123` | `pass123` | Add Products, Restock Stock, View Sales Orders |
