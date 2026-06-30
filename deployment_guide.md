# Deployment Guide — V.K. Furniture Website

This guide walks you through deploying your premium website to production. 

---

## 1. Uprooting to MongoDB Atlas (Production Database)
Currently, the website connects to a local database (`mongodb://localhost:27017`). Production servers (like Vercel or Render) cannot connect to your local computer's database.

1. **Sign up**: Go to [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) and sign up for a free account.
2. **Create a Cluster**: Choose the **M0 Free Tier** cluster (shared CPU/RAM, perfect for startup traffic).
3. **Database User**: Create a database user and password (keep these secure).
4. **Network Access**: Add IP address `0.0.0.0/0` (allows production servers to connect securely).
5. **Get Connection String**: Click **Connect** -> **Drivers** and copy your URI connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

---

## 2. Deploying the FastAPI Backend
Vercel is built for frontends and static files. While it can run Python serverless functions, hosting a long-running FastAPI server is much simpler and more robust on platforms like **Render.com** or **Railway.app** (which have native Python/Uvicorn support).

### Option A: Deploying on Render (Recommended & Free)
1. **GitHub**: Push your `backend/` folder to a repository on GitHub.
2. **Create Web Service**: Sign in to [Render](https://render.com/), click **New** -> **Web Service**, and connect your GitHub repository.
3. **Configure Settings**:
   * **Root Directory**: `backend` (or leave empty if it's a dedicated repository)
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables**:
   Click **Environment** on Render and add:
   * `MONGO_URL` = (Your MongoDB Atlas connection string from Section 1)
   * `DB_NAME` = `vk_furniture`
   * `CORS_ORIGINS` = `https://<your-vercel-frontend-url>.vercel.app` (or `*` to allow all)
5. **Deploy**: Render will build and deploy your API. Copy the live Render URL (e.g., `https://vk-furniture-api.onrender.com`).

---

## 3. Deploying the React Frontend on Vercel
We have already created a [vercel.json](file:///C:/Users/hp/Desktop/VK%20furtinure/frontend/vercel.json) file in your `frontend/` folder. This tells Vercel to route all links to `index.html` so that page reloads on pages like `/catalog` or `/about` work perfectly.

1. **GitHub**: Push your `frontend/` folder to a GitHub repository.
2. **Create Project**: Sign in to [Vercel](https://vercel.com/), click **Add New** -> **Project**, and select your GitHub repository.
3. **Configure Settings**:
   * **Framework Preset**: Create React App (automatically detected).
   * **Root Directory**: `frontend`
4. **Add Environment Variables**:
   Under **Environment Variables** in Vercel, add:
   * `REACT_APP_BACKEND_URL` = `https://<your-render-backend-url>.onrender.com` (The live backend URL you copied from Section 2)
5. **Deploy**: Click **Deploy**. Vercel will compile your Tailwind CSS, build the optimized production assets, and give you a live `.vercel.app` domain.

---

## 4. Testing Your Live Website
Once both are deployed:
1. Open your live Vercel URL.
2. Navigate to the **Custom Design** page and complete a design configurations form.
3. Submit it and verify that:
   * The database record is successfully saved (you can inspect the MongoDB Atlas collections dashboard).
   * The WhatsApp redirection loads with all your configurations pre-filled.
