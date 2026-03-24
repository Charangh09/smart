# Task Management Web Application

## 1. Project Title and Description

This project is a Task Management web application built with the MERN stack. It helps users organize their daily work by creating tasks, updating progress, tracking completion, and reviewing analytics in one place.

It is a full-stack MERN application with a React frontend, Node.js and Express backend, and MongoDB database.

## 2. Project Overview

Users create an account, log in, and manage personal tasks. They can add new tasks, edit or delete existing ones, mark tasks as completed, filter and search tasks, and view analytics that show progress and task distribution.

## 3. Features

- JWT-based authentication with signup and login
- Task management: create, update, delete, and mark complete
- Filtering by status and priority
- Search by task title
- Analytics dashboard with summary and charts

## 4. Technology Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas

## 5. Setup Steps

### Clone Repository

```bash
git clone https://github.com/Charangh09/smart.git
cd smart
```

### Setup Backend

```bash
cd backend
npm install
npm run dev
```

### Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

## 6. Environment Variables

Create `.env` files in both `backend` and `frontend` folders.

### Backend (`backend/.env`)

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 7. API Endpoints

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/complete`

### Filtering

- `GET /api/tasks?status=`
- `GET /api/tasks?priority=`
- `GET /api/tasks?search=`

## 8. Design Decisions

- MERN stack is used because JavaScript is used across frontend and backend, which keeps development simple and consistent.
- JWT authentication is used because it supports secure, stateless authentication for APIs.
- MongoDB is used because task data is flexible and maps naturally to document-based storage.
- REST API design is followed because it is standard, easy to test, and easy to integrate with frontend clients.
- Analytics is included to help users understand productivity trends, not just store tasks.

## 9. Future Improvements

- Drag and drop task reordering
- Real-time notifications and reminders
- Email notifications for due dates
- Team collaboration with shared workspaces
- Attachments and comments for tasks
- Better reporting and export options

## 10. Final Note

This project is built as a practical full-stack learning and portfolio application. It focuses on clean architecture, real-world features, and clear separation between frontend and backend responsibilities.
