# 🚀 Hostinger Auto-Deployment Guide (Full-Stack Laravel + React)

This project is configured for **Single-Domain Auto-Deployment** on Hostinger Web / Cloud Hosting (hPanel) using **GitHub Actions CI/CD**.

Whenever you push to the `main` branch:
1. GitHub Actions compiles the React frontend (`npm run build`).
2. Moves the compiled production assets into Laravel's `backend/public/`.
3. Installs optimized Composer production dependencies (`composer install --no-dev`).
4. Securely uploads all files to your Hostinger `public_html/` via FTP.
5. Serves both the React customer & admin UI (`https://yourdomain.com/menu`, `/admin`, etc.) and the Laravel API (`https://yourdomain.com/api/v1/...`) on the **same domain with zero CORS issues**.

---

## 📋 Prerequisites on Hostinger (hPanel)

### 1. Set PHP Version to 8.2 or 8.3
1. Log in to **Hostinger hPanel**.
2. Go to **Websites** ➔ click **Manage** on your domain.
3. In the search bar or left menu, find **PHP Configuration**.
4. Set the PHP version to **PHP 8.2** or **PHP 8.3** and click **Update**.

---

### 2. Create MySQL Database
1. In hPanel, go to **Databases** ➔ **Management**.
2. Create a new database:
   - **Database Name**: e.g. `u123456789_canteen`
   - **Database Username**: e.g. `u123456789_admin`
   - **Database Password**: Choose a strong password.
3. Note down the Database Name, Username, and Password.

---

### 3. Get Your Hostinger FTP Credentials
1. In hPanel, go to **Files** ➔ **FTP Accounts**.
2. Note down:
   - **FTP Host / Server IP** (e.g., `ftp.yourdomain.com` or `185.xxx.xxx.xxx`)
   - **FTP Username** (e.g., `u123456789`)
   - **FTP Password** (Set or reset the password if needed)
   - **Port**: `21`

---

## 🔐 Step 1: Add GitHub Secrets (Required for Auto-Deployment)

In your GitHub repository:
1. Go to your repository on GitHub: `https://github.com/ASRathore0/Cant`
2. Click **Settings** ➔ **Secrets and variables** ➔ **Actions**.
3. Click **New repository secret** and add the following 3 secrets:

| Secret Name | Value Example | Description |
|---|---|---|
| `HOSTINGER_FTP_SERVER` | `ftp.yourdomain.com` | Hostinger FTP Hostname or Server IP |
| `HOSTINGER_FTP_USERNAME` | `u123456789` | Your Hostinger FTP Username |
| `HOSTINGER_FTP_PASSWORD` | `YourSecretPassword` | Your Hostinger FTP Password |

---

## ⚙️ Step 2: Create `backend/.env` on Hostinger

Before or right after your first deployment, create the production `.env` file on Hostinger:
1. In hPanel, open **File Manager** (under **Files**).
2. Navigate to `public_html/backend/`.
3. If `.env` is not present, create a new file named `.env` (or copy from `.env.example`).
4. Fill in your production values:

```env
APP_NAME="Annapoorna Canteen"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u123456789_canteen
DB_USERNAME=u123456789_admin
DB_PASSWORD=YourDatabasePasswordHere

FILESYSTEM_DISK=public
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Secret key for web-based artisan helper (change this to your own secret)
SETUP_SECRET_KEY=cant_deploy_2026
```

> **Tip for APP_KEY**: You can copy your existing `APP_KEY` from your local `backend/.env` file.

---

## 🚀 Step 3: Trigger Your First Auto-Deployment

Any time you want to deploy, simply push your code:
```bash
git add .
git commit -m "Configure Hostinger deployment"
git push origin main
```

You can view the real-time build and deployment progress:
- Go to your GitHub repository ➔ **Actions** tab ➔ **Deploy Cant to Hostinger**.

---

## ⚡ Step 4: Run Database Migrations & Storage Link

Once the files are uploaded to Hostinger, you need to run migrations to create the database tables.

### Option A: Web-Based 1-Click Setup Runner (No SSH Required)
Open your browser and visit:
```text
https://yourdomain.com/hostinger-setup.php?secret=cant_deploy_2026
```
*(Replace `yourdomain.com` with your actual domain, and use the secret configured in `SETUP_SECRET_KEY`)*

From the setup panel, click:
1. **Run Migrations (`migrate --force`)** ➔ Creates all tables (`canteens`, `categories`, `menu_items`, `users`, etc.).
2. **Link Storage (`storage:link`)** ➔ Links public storage for uploaded canteen logos and dish photos.
3. **Seed Admin User** ➔ Creates the default admin account:
   - **Email:** `admin@annapoornacanteen.com`
   - **Password:** `Admin@123456`
4. **Seed Default Canteens** ➔ Seeds initial canteen network data.
5. **Cache Config & Routes (`optimize`)** ➔ Turbocharges production performance.

> 🔒 **Security Notice:** Once setup is complete, you can delete `backend/public/hostinger-setup.php` or change `SETUP_SECRET_KEY` in your `.env`.

---

### Option B: Via Hostinger SSH / Terminal (Alternative)
If you have SSH access enabled in hPanel:
```bash
cd ~/public_html/backend
php artisan migrate --force
php artisan storage:link
php artisan db:seed --class=AdminUserSeeder --force
php artisan db:seed --class=CanteenSeeder --force
php artisan optimize
```

---

## 🎯 Architecture Summary

- **Frontend Customer Menu**: `https://yourdomain.com/menu`
- **Super Admin Panel**: `https://yourdomain.com/admin/canteens`
- **Admin Dashboard**: `https://yourdomain.com/admin`
- **API Endpoints**: `https://yourdomain.com/api/v1/menu`, `https://yourdomain.com/api/v1/canteens`
- **All routed transparently through root `.htaccess`** with automatic React SPA client-side routing fallback.
