# ⚡ EmpAnalytics — AI-Based Employee Performance Analytics System
### MERN Stack + OpenRouter AI | B.Tech ESE Project

---

## 📁 Project Structure

```
emp-analytics/
├── backend/                  # Node.js + Express API
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Employee.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # React App
│   ├── public/index.html
│   ├── src/
│   │   ├── components/Navbar.js
│   │   ├── context/AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EmployeeList.js
│   │   │   ├── AddEmployee.js
│   │   │   ├── EditEmployee.js
│   │   │   ├── AIRecommendations.js
│   │   │   └── AIRankings.js
│   │   ├── utils/api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 LOCAL SETUP (VSCode)

### Prerequisites
- Node.js v18+ (download: https://nodejs.org)
- MongoDB Atlas account (free): https://cloud.mongodb.com
- OpenRouter account (free): https://openrouter.ai

---

### STEP 1 — Get a MongoDB Atlas URI

1. Go to https://cloud.mongodb.com → Sign up / Log in
2. Create a free cluster (M0 - free tier)
3. Click **Connect** → **Connect your application**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Add a database name: replace `/?` with `/empanalytics?`

---

### STEP 2 — Get an OpenRouter API Key

1. Go to https://openrouter.ai → Sign up
2. Go to **Keys** → Create a new key
3. Copy it (starts with `sk-or-...`)
4. **Free models available** — the app uses `mistralai/mistral-7b-instruct:free`

---

### STEP 3 — Configure Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in:
```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/empanalytics?retryWrites=true&w=majority
JWT_SECRET=mysupersecretkey123changethis
OPENROUTER_API_KEY=sk-or-your-key-here
```

Install dependencies:
```bash
npm install
```

Start the backend:
```bash
npm run dev
```

✅ You should see:
```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

Test it: Open http://localhost:5000 → should show `{ "message": "Employee Analytics API is running ✅" }`

---

### STEP 4 — Configure Frontend

Open a **new terminal**:
```bash
cd frontend
cp .env.example .env
```

The `.env` file content:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Install dependencies:
```bash
npm install
```

Start the frontend:
```bash
npm start
```

✅ Browser opens at http://localhost:3000

---

## 🔑 Usage

1. Go to http://localhost:3000
2. Click **Sign up** → Create your HR/Admin account
3. Log in → Dashboard loads
4. Add employees → Go to AI Recommendations or Rankings

---

## 📡 API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/profile` | Get current user (protected) |

### Employees (all protected — need Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Add employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| GET | `/api/employees/search?department=Dev` | Search/filter |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### AI (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/recommend` | AI recommendation for one employee |
| GET | `/api/ai/rankings` | AI rankings for all employees |

---

## 🌐 DEPLOYMENT ON RENDER

### Part A — Deploy Backend

1. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/emp-analytics.git
   git push -u origin main
   ```

2. Go to https://render.com → Sign up / Log in

3. Click **New** → **Web Service**

4. Connect your GitHub repo

5. Settings:
   - **Name**: `emp-analytics-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

6. Click **Environment** → Add these variables:
   ```
   MONGO_URI = your_mongodb_uri
   JWT_SECRET = your_jwt_secret
   OPENROUTER_API_KEY = your_openrouter_key
   NODE_ENV = production
   ```

7. Click **Create Web Service**

8. Wait ~2 min → You'll get a URL like:
   `https://emp-analytics-backend.onrender.com`

9. Test it: Visit `https://emp-analytics-backend.onrender.com` → Should show the API running message

---

### Part B — Deploy Frontend

1. In your frontend, create `.env.production`:
   ```
   REACT_APP_API_URL=https://emp-analytics-backend.onrender.com/api
   ```
   
   Commit this file:
   ```bash
   git add .
   git commit -m "Add production API URL"
   git push
   ```

2. On Render → **New** → **Static Site**

3. Connect the same GitHub repo

4. Settings:
   - **Name**: `emp-analytics-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

5. Click **Create Static Site**

6. Wait ~3 min → You'll get a URL like:
   `https://emp-analytics-frontend.onrender.com`

---

### Part C — Fix CORS for Production (Already Handled)

The backend uses `cors()` without restrictions. If you want to restrict:

In `backend/server.js`, replace `app.use(cors())` with:
```js
app.use(cors({ origin: 'https://emp-analytics-frontend.onrender.com' }));
```

---

## 🧪 Testing with Postman/Thunder Client

### 1. Signup
```
POST http://localhost:5000/api/auth/signup
Body (JSON):
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Login (copy the token from response)
```
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@test.com", "password": "password123" }
```

### 3. Add Employee (add Authorization header: `Bearer <token>`)
```
POST http://localhost:5000/api/employees
Headers: Authorization: Bearer <your_jwt_token>
Body:
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

### 4. Search by Department
```
GET http://localhost:5000/api/employees/search?department=Development
Headers: Authorization: Bearer <token>
```

### 5. AI Recommendation
```
POST http://localhost:5000/api/ai/recommend
Headers: Authorization: Bearer <token>
Body: { "employeeId": "<employee_id_from_step_3>" }
```

### 6. AI Rankings
```
GET http://localhost:5000/api/ai/rankings
Headers: Authorization: Bearer <token>
```

---

## ⚠️ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `MongoDB connection failed` | Check MONGO_URI in .env, whitelist IP `0.0.0.0/0` in Atlas Network Access |
| `AI API failed` | Check OPENROUTER_API_KEY in .env |
| `CORS error` | Backend isn't running, or REACT_APP_API_URL is wrong |
| `npm install` fails | Use Node.js v18+, delete `node_modules` and retry |
| Port 5000 busy | Change PORT in .env |

---

## 📋 Submission Checklist

- [ ] Code in ZIP / GitHub
- [ ] Screenshots of all API responses (Postman)
- [ ] MongoDB Atlas screenshot (employees stored)
- [ ] Render backend deployment screenshot + live URL
- [ ] Render frontend deployment screenshot + live URL
- [ ] PDF report submitted on Moodle
