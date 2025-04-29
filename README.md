# 🏠 Smart Home Stock and Sharing Management System

A modern full-stack web application for efficiently managing household items, categories, users, and donations. Designed to reduce waste, improve resource sharing, and streamline home inventory management for individuals and families.

> 🎓 Final Project – 3rd Year 2nd Semester  
> Faculty of Computing, Sri Lanka Institute of Information Technology (SLIIT)


## 📌 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [👥 Team & Responsibilities](#-team--responsibilities)
- [🖼️ Screenshots](#️-screenshots)
- [⚙️ Installation & Setup](#️-installation--setup)
- [📂 Project Structure](#-project-structure)


## 🚀 Features

- ✅ User Authentication & Authorization  
- ✅ Add, Edit, Delete & View Household Items  
- ✅ Category Management (Food, Medicine, Stationery, etc.)  
- ✅ Donation Management with Quantity Validation  
- ✅ Community-Based Notice Sharing (Digital Board)  
- ✅ Search, Sort & Filter Items by Category, Name, or Expiry  
- ✅ Expiry Date Validation and Notifications  
- ✅ PDF Report Generation of Inventory Items  
- ✅ Fully Responsive Interface (Mobile + Desktop)  



## 🛠️ Tech Stack

**Frontend:**  
- ⚛️ React.js  
- 🎨 Ant Design (UI Library)  
- 📅 Moment.js (Date formatting)  
- 🧠 Valtio (State Management)  
- 🧾 jsPDF (PDF Export)  

**Backend:**  
- 🌐 Node.js & Express.js  
- 🍃 MongoDB + Mongoose (Database)  

**Other Tools:**  
- 🔐 JWT for authentication  
- 🔄 RESTful API structure  
- 🔍 ESLint & Prettier for code quality  

## 👥 Team & Responsibilities

| Name                          | Student ID     | Responsibilities                                                                 |
|------------------------------|----------------|----------------------------------------------------------------------------------|
| **P.L.G.Oshan Lahiru Kumara**| IT22569318     | 🔹 Donation Management<br>🔹 Digital Community-based Notice Sharing              |
| **Kalehewatta K.K.K.G.**     | IT22576248     | 🔹 Item Management (CRUD operations, filtering, expiry validation)               |
| **Kaushan M.K.**             | IT22569622     | 🔹 User Management (Registration, Login, Role-based access)                      |
| **Ranasinghe K.D.**          | IT22594990     | 🔹 Category Management (Category CRUD and UI integration)                        |

## 🖼️ Screenshots

> 📌 *(Insert screenshots or link to the `/screenshots/` directory if hosted on GitHub)*

- Item Management Table  
- Add/Edit Item Modal with Validation  
- Donation Submission & View Panel  
- Digital Notice Sharing Board  
- PDF Inventory Report Output  

## ⚙️ Installation & Setup

### 🔧 Prerequisites
- Node.js ≥ 16  
- MongoDB installed locally or a cloud URI (MongoDB Atlas)

## 🔌 TO Get The Project
```bash
git clone https://github.com/oshanLahiru0307/ITPM_Project.git
cd ITPM_Project
```

### 🔌 Backend Setup
```bash
cd backend
npm install
# Create a .env file and add:
# MONGO_URI=<your_mongodb_connection_string>
# JWT_SECRET=<your_secret>
npm start
```

### 🌐 Frontend Setup
```bash
cd frontend
npm install
npm start
```

> App will run on `http://localhost:3000`