# 🚀 GigFlow Backend API

## 🎯 About

The **GigFlow Backend API** is a scalable Node.js + Express server powering a freelance marketplace platform. It manages authentication, gig workflows, bidding systems, and real-time hiring notifications.

This project demonstrates strong backend fundamentals including **secure authentication, clean architecture, and real-time communication**.

---

## 🧠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (HttpOnly cookies)
* **Real-time:** Socket.IO
* **Security:** bcrypt, CORS, cookie-parser
* **Other:** dotenv, rate limiting

---

## ✨ Features

### 🔐 Authentication & Security

* JWT-based authentication with **HttpOnly cookies**
* Password hashing using **bcrypt**
* Protected routes using middleware
* Role-based access control (Owner / Client)
* Rate limiting for API protection

---

### 💼 Gig Management

* Create, update, and **soft delete** gigs
* Search and filter gigs
* Only owners can manage their gigs
* Pagination support

---

### 💰 Bidding System

* Clients can place bids on gigs
* Owners can view and accept bids
* Update bids (only when pending)
* Prevent bidding on own gigs

---

### ⚡ Real-Time Features

* Socket.IO integration
* Real-time hire notifications
* Online/offline user tracking

---

### 🔒 Advanced Backend Features

* MongoDB transactions for **atomic hiring**
* Centralized error handling
* Clean architecture (controllers, models, middleware)
* RESTful API design

---

## 📁 Project Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Dev-ayansharma/gigbflowback.git
cd gigbflowback
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in root:

```env
MONGODB_URI=your_mongodb_connection
PORT=9000
JWT_SECRET=your_secret
TOKEN_SECRET_EXPIRES_IN=1d
ORIGIN=http://localhost:3000
```

---

### 4️⃣ Run the Project

#### Development

```bash
npm run dev
```

#### Production

```bash
npm start
```

---

## 🌐 API Base URL

```
http://localhost:9000/app
```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| POST   | /auth/register | Register user    |
| POST   | /auth/login    | Login user       |
| GET    | /auth/me       | Get current user |
| POST   | /auth/logout   | Logout user      |

---

### 💼 Gigs

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | /gigs/allgigs               | Get all gigs            |
| GET    | /gigs/allgigs?title=keyword | Search gigs by title    |
| POST   | /gigs                       | Create gig (Owner only) |
| DELETE | /gigs/:gigId                | Soft delete gig (owner only)|

---

### 💰 Bids

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | /bids/:gigId      | Place bid (Client only)  |
| GET    | /bids/:gigId      | Get bids (Owner only)    |
| PATCH  | /bids/:bidId      | Update bid (Client only) |
| PATCH  | /bids/:bidId/hire | Accept bid (Owner only)  |

---

## 🔐 Roles & Permissions

| Action     | Owner | Client |
| ---------- | ----- | ------ |
| Create Gig | ✅     | ❌      |
| View Gigs  | ✅     | ✅      |
| Place Bid  | ❌     | ✅      |
| View Bids  | ✅     | ❌      |
| Accept Bid | ✅     | ❌      |

---

## ⚡ Real-Time Events (Socket.IO)

| Event    | Description                     |
| -------- | ------------------------------- |
| register | Register user socket connection |
| hired    | Notify freelancer when hired    |

---

## 🧪 Testing

You can test APIs using:

* Postman
* Thunder Client
* cURL

---

## 🧠 Design Decisions & Tradeoffs

* Used **HttpOnly cookies** for better security vs localStorage
* Implemented **soft delete** for data recovery and auditability
* Applied **MongoDB transactions** to prevent race conditions
* Separated logic using **middleware + controllers**
* Used **rate limiting** to prevent abuse

---

## 🚀 Future Improvements

* 🔄 Refresh token system
* 💬 Real-time chat between users
* 📊 Admin dashboard
* 🧾 Audit logs
* 🧠 Advanced RBAC (permissions-based)

---

## 👨‍💻 Author

**Ayan Sharma**

---

## ⭐ Final Note

This project is built with a focus on:

* Clean architecture
* Security best practices
* Real-world backend design

> The goal is not just functionality, but demonstrating strong backend engineering thinking.

---

