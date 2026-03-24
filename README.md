# TaskFlow - Full-Stack Task Management App

A modern task management web app with authentication, task CRUD, filtering, pagination, and analytics.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Recharts + Framer Motion
- Backend: Node.js + Express + JWT + bcrypt
- Database: MongoDB + Mongoose

## Project Structure

- `backend/` Express API and MongoDB models
- `frontend/` React client app

## Backend Setup

1. Go to backend:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create env file:
   - copy `.env.example` to `.env`
4. Fill env values:
   - `PORT=5000`
   - `MONGO_URI=mongodb://127.0.0.1:27017/task-manager`
   - `JWT_SECRET=<your-strong-secret>`
5. Start backend:
   - `npm run dev`

## Frontend Setup

1. Go to frontend:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Create env file:
   - copy `.env.example` to `.env`
4. Start frontend:
   - `npm run dev`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/analytics/summary`

## Feature Notes

- JWT-protected task routes
- Password hashing with bcrypt
- Email/password validation
- Task filters by status, priority, and title search
- Combined filters and pagination
- Analytics cards + pie/bar charts
- Responsive UI with dark mode toggle

## Deploy On Render

This repository includes a Render Blueprint file at [render.yaml](render.yaml).

### Option A: One-Click Blueprint Deploy (Recommended)

1. Push this project to GitHub.
2. In Render, choose New -> Blueprint.
3. Select your repository.
4. Render will create two services:
   - `taskflow-api` (Node web service)
   - `taskflow-web` (Static frontend)
5. Set required backend env vars in Render:
   - `MONGO_URI`
   - `JWT_SECRET`
6. After backend is live, copy its public URL and set frontend env var:
   - `VITE_API_BASE_URL=https://<your-backend-service>.onrender.com/api`
7. Trigger a redeploy of `taskflow-web` after setting `VITE_API_BASE_URL`.

### Option B: Manual Services

Create services manually in Render with these settings:

Backend (`taskflow-api`):
- Type: Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Env Vars:
  - `NODE_ENV=production`
  - `MONGO_URI=<your-mongodb-connection-string>`
  - `JWT_SECRET=<your-strong-secret>`

Frontend (`taskflow-web`):
- Type: Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Env Vars:
  - `VITE_API_BASE_URL=https://<your-backend-service>.onrender.com/api`

### Notes

- Use MongoDB Atlas (or another hosted MongoDB), since Render does not provide MongoDB by default.
- Free-tier Render web services may spin down when idle.
