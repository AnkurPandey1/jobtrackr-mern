# 🎯 JobTrackr - Job Application Tracking System

JobTrackr is a full-stack web application designed to help job seekers manage, organize, and monitor their job search workflows. It aggregates metrics using MongoDB Pipelines and presents real-time data visualizations via Recharts, with secure JWT + Cookie auth.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router DOM (v6)
- **Forms:** React Hook Form
- **Charts:** Recharts
- **Styling:** Tailwind CSS (Custom HSL Dark Navy Slate theme)
- **Icons:** React Icons
- **HTTP Client:** Axios (automatic credential forwarding)

### Backend & Database
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT (JSON Web Tokens) inside HTTP-only cookies, password hashing with BcryptJS

---

## 📂 Project Structure

```text
/
├── client/                     # Frontend Vite + React Project
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbars, Sidebars, ProtectedRoutes, Loaders
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useToast Hook
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Lists, Profiles
│   │   ├── services/           # Axios instance configuration
│   │   ├── App.jsx             # Routes and context aggregators
│   │   ├── main.jsx            # DOM Bootstrapper
│   │   └── index.css           # Tailwind + Glassmorphism style system
│   ├── vite.config.js          # API development proxy setting
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                     # Backend Node + Express API Server
    ├── config/                 # DB connection modules
    ├── controllers/            # Auth, Jobs, and Stats pipeline controllers
    ├── middleware/             # Cookie token authentication guard
    ├── models/                 # User and Job Mongoose schemas
    ├── routes/                 # API endpoint routing
    ├── server.js               # Express application entrypoint
    ├── .env.example            # Environment configuration mock
    └── package.json
```

---

## 🛠️ Installation & Local Development

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas Account** (or local MongoDB database instance)

### 2. Database & Server Setup
1. Open your terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory (copying `.env.example` as a template):
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables inside `.env`:
   - Set `MONGO_URI` to your MongoDB Atlas connection string.
   - Change `JWT_SECRET` to a secure key.
   - Adjust ports if necessary (defaults: server at `5000`, client proxy matches `5000`).

5. Run the server in development mode (using Nodemon):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. In a new terminal, navigate to the client folder:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.

---

## 🔌 API Documentation

### Auth Endpoints (`/api/auth`)
- `POST /register`: Registers a new user. Expects JSON: `{ name, email, password }`. Issues token cookie.
- `POST /login`: Validates user credentials. Expects JSON: `{ email, password }`. Issues token cookie.
- `GET /logout`: Clears the authentication token cookie.
- `GET /current-user`: Retrieves current logged-in user profile (protected).

### Jobs Endpoints (`/api/jobs`)
- `GET /`: Retrieves all job applications for the authenticated user. Supports:
  - Query parameter `search` (matches company/position)
  - Query parameter `status` (Applied, Interview, Assessment, Offer, Rejected)
  - Query parameter `sort` (latest, oldest, company, status)
  - Query parameter `page` (pagination, default limit = 10 items)
- `POST /`: Records a new job application. Expects JSON: `{ company, position, location, status, salary, applicationDate, deadline, notes, jobLink }`.
- `GET /:id`: Fetches detailed logs of a specific job application.
- `PATCH /:id`: Modifies an existing job application.
- `DELETE /:id`: Permanently deletes an application.

### Stats Endpoints (`/api/stats`)
- `GET /`: Aggregates application metrics (Total, Interview count, Offer count, Rejections count, Success Rate %, and monthly trend counts over the past 12 months) via MongoDB pipelines.

---

## 📦 Deployment Guide

### Database (MongoDB Atlas)
1. Log into your MongoDB Atlas console and create a new project/cluster.
2. In **Database Access**, create a user with read/write permissions.
3. In **Network Access**, whitelist all IP addresses (`0.0.0.0/0`) or configure specific server IP whitelist parameters.
4. Retrieve the connection string under **Connect** -> **Drivers** and save it for deployment.

### Backend (Render)
1. Create a new account or log into [Render](https://render.com/).
2. Select **New Web Service** and link it to your GitHub Repository.
3. Set the **Root Directory** to `server`.
4. Configure the Build Command:
   ```bash
   npm install
   ```
5. Configure the Start Command:
   ```bash
   npm start
   ```
6. Add the following **Environment Variables** in the Web Service dashboard settings:
   - `PORT`: `10000` (or leave default)
   - `MONGO_URI`: `your_atlas_connection_string`
   - `JWT_SECRET`: `your_production_secret`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-frontend-vercel-subdomain.vercel.app`
7. Click **Deploy Web Service**. Render will expose a public URL (e.g. `https://jobtrackr-api.onrender.com`).

### Frontend (Vercel)
1. Create an account or log into [Vercel](https://vercel.com/).
2. Click **Add New Project** and select your GitHub repository.
3. In the project config settings, set **Root Directory** to `client`.
4. Vercel automatically detects Vite framework. Ensure build command is `npm run build` and output directory is `dist`.
5. Since our app uses relative URLs `/api/...` to support simple environments, we must configure a Vercel URL rewrite rules dictionary.
6. Create a `vercel.json` file inside your **client** root directory if you deploy cross-domain, or use Vercel's Serverless functions, or update Vite configuration to fetch from your backend Render URL.
   > **Note on Client-to-Server Routing:**
   > In a production build, update the backend API baseURL inside [client/src/services/api.js](file:///Users/ankur/Desktop/Microsoft%20project/client/src/services/api.js) to map directly to your backend service url on Render, or configure Vercel redirects:
   > ```json
   > {
   >   "rewrites": [
   >     { "source": "/api/:path*", "destination": "https://your-backend-render-app.onrender.com/api/:path*" }
   >   ]
   > }
   > ```
7. Deploy the project.
