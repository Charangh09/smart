TaskFlow - Task Management Web Application

This is a full-stack task management web application built using the MERN stack. The purpose of this project is to help users manage their daily tasks efficiently by providing features like task creation, tracking, filtering, and analytics.

---

Project Overview

The application allows users to organize their work by creating tasks, updating them, and marking them as completed. It also provides filtering and search options to quickly find tasks, along with a dashboard that shows useful insights about task progress.

---

Features

Authentication

Users can sign up and log in securely. Authentication is handled using JSON Web Tokens, and passwords are stored in a hashed format.

Task Management

Users can create, update, delete, and mark tasks as completed. Each task includes a title, description, status, priority, and due date.

Filtering and Search

Tasks can be filtered by status and priority. Users can also search tasks by title and sort them based on different criteria.

Analytics

The application provides insights such as total tasks, completed tasks, pending tasks, and completion percentage. Charts are used to visualize this data.

User Interface

The application has a clean and responsive interface with dark mode support, making it easy to use across different devices.

---

Technology Stack

Frontend

React with Vite
Tailwind CSS

Backend

Node.js
Express.js

Database

MongoDB Atlas

---

Setup Steps

Clone the repository

git clone https://github.com/your-username/your-repo.git
cd your-repo

Backend setup

cd server
npm install
npm start

Frontend setup

cd client
npm install
npm run dev

---

Environment Variables

Create a .env file in the backend folder and add:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Create a .env file in the frontend folder and add:

VITE_API_URL=http://localhost:5000

---

API Endpoints

Authentication

POST /api/auth/signup
Creates a new user account

POST /api/auth/login
Authenticates user and returns a token

Task Management

GET /api/tasks
Fetch all tasks for the logged-in user

POST /api/tasks
Create a new task

PUT /api/tasks/
Update an existing task

DELETE /api/tasks/
Delete a task

PATCH /api/tasks//complete
Mark a task as completed

Filtering and Search

GET /api/tasks?status=Todo
Filter tasks by status

GET /api/tasks?priority=High
Filter tasks by priority

GET /api/tasks?search=keyword
Search tasks by title

---

Design Decisions

The project follows a modular structure by separating frontend and backend to maintain scalability and clarity.

JWT authentication is used to ensure secure access to protected routes without maintaining server-side sessions.

MongoDB is chosen because it provides flexibility in storing task-related data and works well with JavaScript-based applications.

React is used for building a dynamic and responsive user interface, while Tailwind CSS helps in maintaining a clean and consistent design.

The backend is designed using RESTful APIs to keep communication between client and server simple and structured.

The analytics feature is implemented to give users a quick overview of their productivity, improving usability.

---

---

Future Improvements

Future enhancements include adding drag and drop functionality, notifications, improved analytics, and user profile customization.

---

Final Note

This project demonstrates practical implementation of full-stack development concepts and focuses on building a clean, user-friendly, and scalable application.
