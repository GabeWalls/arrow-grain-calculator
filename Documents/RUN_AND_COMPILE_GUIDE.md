# Arrow Grain Calculator — Run & Compile Guide

This guide explains how to set up and run the **Arrow Grain Calculator** (frontend + Node/Express API + MongoDB).  
It also lists all dependencies, environment variables, and troubleshooting steps.

---

## 1) Prerequisites

- **Node.js** 18+ and **npm** (https://nodejs.org)
- **MongoDB Community Server** 6.0+ running locally OR a MongoDB Atlas cluster
- **Git** (optional, for cloning)

> Check versions
```bash
node -v
npm -v
mongod --version
```

## 2) Project Structure (key folders)

```
root/
  backend/
    models/ArrowBuild.js
    routes/grainCalculator.js
    utils/calculateGrains.js
    server.js
  frontend/
    src/App.js
    src/ArrowSVG.jsx
    vite.config.js
  docs/ (optional)
```

> This guide assumes the API runs on **http://localhost:5000** and the React app on **http://localhost:5173**.

## 3) Environment Variables

Create a **.env** file in `backend/`:

```
# backend/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/arrow_calculator
CORS_ORIGIN=http://localhost:5173
```

(Optional) Create a **.env** file in `frontend/` if you use a base URL:
```
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

## 4) Install & Run — Backend

From the `backend/` folder:

```bash
npm install
npm run dev        # or: node server.js
```

The API should print something like:
```
Server listening on http://localhost:5000
Connected to MongoDB
```

### API Endpoints (current)
- `POST /api/save` – Save a build
- `GET  /api/builds` – Fetch all builds (sorted newest first)
- `PUT  /api/builds/:id` – Update a build
- `DELETE /api/builds/:id` – Delete a build
- `POST /api/calculate` – Calculate grain total from a component array

## 5) Install & Run — Frontend (Vite + React)

From the `frontend/` folder:

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually: http://localhost:5173).

If using the env base URL, ensure your API is reachable at `VITE_API_URL`.

## 6) Seeding Test Data (75 records)

This resubmission includes a seed script that inserts ~75 realistic builds.
From `backend/`:

```bash
npm run seed
```
> The script uses `MONGO_URI` from your backend `.env`.

To clear builds later:
```bash
node -e "require('dotenv').config();const m=require('mongoose');const A=require('./models/ArrowBuild');(async()=>{await m.connect(process.env.MONGO_URI);await A.deleteMany({});console.log('Cleared');process.exit(0);})()"
```

## 7) Troubleshooting

- **CORS errors**: Ensure `CORS_ORIGIN` matches your frontend URL and the backend enables CORS accordingly.
- **ECONNREFUSED**: MongoDB not running or `MONGO_URI` incorrect. Start MongoDB or update the URI.
- **Port in use**: Change `PORT` in backend `.env` or stop the process using port 5000.
- **Axios failing on frontend**: Confirm `VITE_API_URL` is set or axios calls point to `http://localhost:5000/api`.

## 8) Compile/Build (optional for submission)

To production-build the frontend:
```bash
npm run build   # from frontend/
```
To serve the built assets, use any static server (e.g., `npm i -g serve` then `serve dist`).

---

**Contact Notes for Grader:**  
This guide, plus the included seed and benchmark scripts, supports the requested 50–100 test records and the before/after performance measurements.
