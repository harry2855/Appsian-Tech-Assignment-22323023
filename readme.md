# Project Management System

## Overview
This project is a **full-stack web application** designed to evaluate proficiency in developing robust, modular, and secure systems. It implements a **minimal project management platform** where users can register, log in, create projects, and manage tasks within those projects. The focus is on clean architecture, proper authentication, routing, and data relationships.

---

## Business Context
The application replicates a lightweight **project and task management tool** that allows individual users to manage their workflow efficiently. Each user can handle multiple projects, each containing its own set of tasks. The system ensures **strict data isolation**, so users can only access and modify their own resources.

---

## Core Features

### 1. Authentication
- Secure **user registration** and **login** using **JSON Web Tokens (JWT)**.  
- Authenticated users can access only their own data.  
- Passwords are securely hashed before being stored.

### 2. Projects
- Each user can create and manage multiple projects.
- Each project includes:
  - A **title** (mandatory)
  - A **description** (optional)
  - An automatically set **creation date**
- Each project is uniquely tied to its creator.

### 3. Tasks
- Each project can have multiple tasks.
- Each task includes:
  - A **title** (mandatory)
  - An optional **due date**
  - A **completion status**
  - A reference to its **parent project**

### 4. Smart Scheduler
- Includes a **dependency-aware scheduler** that analyzes relationships between projects and tasks.  
- If one task depends on another project, it provides scheduling advice suggesting that the dependent project should be completed first.

---

## Tech Stack

### Backend
- **.NET 8 (C#)** – API for authentication, projects, and task management  
- **Entity Framework Core** – ORM for database management  
- **PostgreSQL** – Persistent database  
- **JWT Authentication** – Secure session management  

### Frontend
- **React (TypeScript)** – Responsive user interface  
- **Vite** – Frontend build tool  
- **Axios** – For API communication  
- **React Router** – For client-side navigation  


---

## Project Structure

```
project-management-system/
├── backend/
│   └── MiniProjectManager.API/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       ├── Repositories/
│       └── Program.cs
└── frontend/
    ├── src/
        ├── components/
        ├── hooks/
        └── services/
        └── types/
```

---

## Setup Instructions

### Prerequisites
- [.NET SDK 8.0+](https://dotnet.microsoft.com/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

### 1. Run the Backend

```bash
cd backend/MiniProjectManager.API
dotnet restore
dotnet run
```

This will start the backend server, typically on `http://localhost:5000`.

---

### 2. Run the Frontend

Open a **new terminal window**, then execute:

```bash
cd mini-project-manager-ui
npm i
npm run dev
```

This will launch the frontend at `http://localhost:5173`.

---

## Future Enhancements
- Add task prioritization and reminders.  
- Enable collaboration features for multiple users.  
- Introduce time tracking and analytics.  
- Enhance the smart scheduler with predictive planning capabilities.
