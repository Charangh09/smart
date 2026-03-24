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

## Deploy: MongoDB Atlas + Cyclic + Vercel

This project is ready for the stack you requested:

- Database: MongoDB Atlas
- Backend: Cyclic
- Frontend: Vercel

### 1) MongoDB Atlas (Database)

1. Create a free cluster in MongoDB Atlas.
2. In Database Access, create a database user.
3. In Network Access, allow your backend host (or `0.0.0.0/0` for quick setup).
4. Copy connection string and replace placeholders:
   - `mongodb+srv://<username>:<password>@<cluster-url>/task-manager?retryWrites=true&w=majority`

### 2) Cyclic (Backend)

Create a Node app from this repo and configure:

- Root directory: `backend`
- Start command: `npm start`

Set environment variables in Cyclic:

- `NODE_ENV=production`
- `MONGO_URI=<your-atlas-connection-string>`
- `JWT_SECRET=<your-strong-secret>`
- `CORS_ORIGIN=https://<your-vercel-domain>`

After deploy, verify health endpoint:

- `https://<your-cyclic-backend-domain>/api/health`

### 3) Vercel (Frontend)

Import this same GitHub repo in Vercel with:

- Framework preset: `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set frontend environment variable in Vercel:

- `VITE_API_BASE_URL=https://<your-cyclic-backend-domain>/api`

The file [frontend/vercel.json](frontend/vercel.json) is included so React Router routes work on refresh.

### 4) Final Step (Important)

Once Vercel gives you the final frontend URL:

1. Copy that Vercel URL.
2. Update `CORS_ORIGIN` in Cyclic to this URL.
3. Redeploy backend.

### Optional: Render

If you want to deploy on Render later, [render.yaml](render.yaml) is already included.
