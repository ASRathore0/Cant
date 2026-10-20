# Annapoorna Canteen — Premium Digital Menu & Admin Control Hub

> **Location:** Gaur City Mall Basement Parking, Sector 4, Greater Noida West, UP - 201009  
> **Brand Identity:** 100% Pure Vegetarian | *"Good Food. Made Fresh. Served with Respect."*

---

## 🍽️ Overview

**Annapoorna Canteen** is a production-oriented, database-backed digital menu and restaurant administration platform built specifically for the high-volume canteen environment at Gaur City Mall Basement Parking.

It provides:
- **Customer Experience (`/menu`):** Mobile-first, lightning-fast digital menu reached via customer table QR scans. Features pure vegetarian indicators, real-time item availability ("Ready to Serve" vs. "Currently Unavailable"), structured pricing (supporting fixed prices, price ranges like ₹40–₹70, and packaged MRPs), instant category filtering, and direct Call/WhatsApp counter assistance.
- **Admin Control Hub (`/admin/*`):** Secure administrative back-office protected by Laravel Sanctum token authentication. Enables counter managers to toggle live item availability in 1 click, edit item details, upload food photography, manage categories, customize restaurant notices (including Indian Armed Forces discount honor banners), and download high-resolution QR standees.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + TypeScript | Modern, type-safe, ultra-fast client |
| **Styling** | Tailwind CSS | Curated Annapoorna brand palette (`#063D29`, `#075C35`, `#FAF8F1`, `#E8C928`) |
| **Icons** | Lucide React | High-clarity iconography |
| **QR Engine** | QRCode (`qrcode`) | High-resolution SVG/PNG canvas generator |
| **API Client**| Axios | Centralized interceptors, bearer tokens, error handling |
| **Backend** | Laravel 12 (PHP 8.2+) | Enterprise RESTful JSON API |
| **Auth** | Laravel Sanctum | Token-based secure administrator authentication |
| **Database** | MySQL / MariaDB (10.4+) | Structured relational database with foreign key constraints |
| **File Storage** | Laravel Public Disk (`storage/`) | Secure image upload, MIME validation & symlinked assets |

---

## 📁 Repository Structure

```
c:\Sampp\htdocs\Cant\
├── backend/                       # Laravel RESTful JSON API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # Auth, Menu, Admin, Categories, Settings Controllers
│   │   ├── Http/Requests/         # Form validation rules (MIME, sizes, prices)
│   │   ├── Http/Resources/        # Consistent API JSON transformations
│   │   └── Models/                # Eloquent models (MenuItem, Category, Setting, QrScan)
│   ├── config/                    # cors.php, sanctum.php, database.php
│   ├── database/
│   │   ├── migrations/            # Database schema with strict constraints
│   │   └── seeders/               # Photographed reference menu & admin seeds
│   ├── routes/api.php             # Versioned REST API endpoints (/api/v1/...)
│   └── tests/Feature/             # Automated test suite (13 passing tests)
│
├── frontend/                      # React + Vite + TypeScript Application
│   ├── public/
│   │   └── logo.png               # Official Annapoorna Canteen brand asset
│   ├── src/
│   │   ├── components/            # Navbar, Hero, CategoryChips, MenuCard, Footer, AdminLayout
│   │   ├── context/               # AuthContext (token storage, login/logout)
│   │   ├── pages/                 # PublicMenuPage, AdminLogin, AdminDashboard, AdminMenu, AdminCategories, AdminSettings
│   │   ├── services/api.ts        # Typed API service abstraction layer
│   │   ├── types/index.ts         # TypeScript interfaces
│   │   ├── index.css              # Custom brand styling & scroll utilities
│   │   └── App.tsx                # Client-side router & protected route guards
│   ├── .env                       # Local frontend environment variables
│   └── vite.config.ts             # Vite build configuration
│
└── README.md                      # Complete system documentation
```

---

## ⚡ Quick Start Guide (Windows)

### Prerequisites
- **PHP 8.2+** with extensions `pdo_mysql`, `curl`, `mbstring`, `fileinfo`, `gd`, `openssl`, `zip`
- **Composer 2.x**
- **Node.js 20+ / 22+** and **npm**
- **MySQL / MariaDB** (via XAMPP or standalone service) running on port 3306

---

### Step 1: Backend Setup

1. Open PowerShell and navigate to the backend:
   ```powershell
   cd c:\Sampp\htdocs\Cant\backend
   ```

2. Verify or create `.env` file (configured for MySQL):
   ```ini
   APP_NAME="Annapoorna Canteen"
   APP_ENV=local
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=annapoorna_canteen
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. Create the database in MySQL (if not already created):
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS annapoorna_canteen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

4. Run migrations and seed reference menu data:
   ```powershell
   php artisan migrate:fresh --seed
   ```

5. Ensure storage symlink is connected:
   ```powershell
   php artisan storage:link
   ```

6. Run the Laravel backend server (binding to 0.0.0.0 enables testing from phones on your Wi-Fi):
   ```powershell
   php artisan serve --host=0.0.0.0 --port=8000
   ```
   *Backend is accessible locally and across your Wi-Fi network at `http://<your-ip>:8000`.*

---

### Step 2: Frontend Setup

1. Open a new PowerShell terminal and navigate to the frontend:
   ```powershell
   cd c:\Sampp\htdocs\Cant\frontend
   ```

2. Verify `.env` configuration:
   ```ini
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_STORAGE_BASE_URL=http://localhost:8000
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev -- --port 5173 --host
   ```
   *Frontend is now accessible at `http://localhost:5173`.*

---

## 🔐 Administrator Access

| Role | Email | Password |
| :--- | :--- | :--- |
| **Store Manager** | `admin@annapoornacanteen.com` | `Annapoorna@2026` |

- **Login URL:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Customer Menu:** [http://localhost:5173/menu](http://localhost:5173/menu)

### Creating Additional Administrators
To create another administrator via Laravel Tinker:
```powershell
cd c:\Sampp\htdocs\Cant\backend
php artisan tinker
```
```php
\App\Models\User::create([
    'name' => 'Counter Manager',
    'email' => 'manager@annapoornacanteen.com',
    'password' => bcrypt('SecurePassword123'),
    'role' => 'admin',
]);
```

---

## 📡 API Endpoints Documentation

### Public Endpoints
- `GET /api/v1/menu` — Full public menu with active categories, items, and settings. Supports `?from_qr=1` to log anonymous counter scans.
- `GET /api/v1/categories` — List of active categories.
- `GET /api/v1/restaurant` — Public settings (contact numbers, hours, location, army discount).
- `POST /api/v1/qr-scans` — Record counter QR code scan event.

### Admin Authentication
- `POST /api/v1/admin/login` — Rate-limited administrator authentication (returns Bearer Token).
- `POST /api/v1/admin/logout` — Revokes current token (`auth:sanctum`).
- `GET /api/v1/admin/me` — Authenticated staff profile (`auth:sanctum`).

### Admin Operations (`auth:sanctum` Protected)
- `GET /api/v1/admin/dashboard` — Real metrics (Total, Available, Unavailable, Categories, Scans, Recent items).
- `GET /api/v1/admin/menu-items` — Filterable/searchable menu item list with pagination.
- `POST /api/v1/admin/menu-items` — Create menu item (supports multipart image upload).
- `GET /api/v1/admin/menu-items/{id}` — Item detail.
- `POST /api/v1/admin/menu-items/{id}` / `PUT` — Update menu item & replace image.
- `DELETE /api/v1/admin/menu-items/{id}` — Delete item & clean up storage file.
- `PATCH /api/v1/admin/menu-items/{id}/availability` — Instant 1-click availability toggle.
- `PATCH /api/v1/admin/menu-items/{id}/featured` — Toggle Bestseller status.
- `GET /api/v1/admin/categories` — Category list with item counts.
- `POST /api/v1/admin/categories` — Create category.
- `PUT /api/v1/admin/categories/{id}` — Update category.
- `DELETE /api/v1/admin/categories/{id}` — Delete category (**Blocked if category contains items**).
- `GET /api/v1/admin/settings` — Get restaurant settings.
- `POST /api/v1/admin/settings` / `PUT` — Update settings and logo.

---

## 🧪 Automated Testing

The backend includes a comprehensive PHPUnit/Pest Feature test suite (`backend/tests/Feature/AnnapoornaApiTest.php`):
```powershell
cd c:\Sampp\htdocs\Cant\backend
php artisan test
```

**Test Coverage Highlights:**
- Public menu returns active categories and items.
- Public restaurant settings endpoint returns brand parameters.
- Real QR scan analytics recording.
- Unauthenticated requests to `/admin/*` are rejected with HTTP 401.
- Admin login with valid credentials returns Sanctum token.
- Invalid credentials fail with HTTP 422.
- Dashboard metrics and real-time item availability toggle.
- Item creation with validation (negative prices rejected).
- Safe category deletion protection (rejects deleting categories with active items).
- Updating restaurant settings.

---

## 🚀 Production Deployment Checklist

1. **Environment Configuration:**
   - Set `APP_ENV=production` and `APP_DEBUG=false` in `backend/.env`.
   - Generate secure application key: `php artisan key:generate`.
   - Update `APP_URL` and `FRONTEND_URL` to your production HTTPS domains.
   - Set `VITE_API_BASE_URL=https://api.yourdomain.com/api/v1` in `frontend/.env.production`.

2. **Frontend Production Build:**
   ```powershell
   cd c:\Sampp\htdocs\Cant\frontend
   npm run build
   ```
   *Deploys the static assets from `frontend/dist` to Nginx, Apache, or cloud CDN.*

3. **Backend Optimization:**
   ```powershell
   cd c:\Sampp\htdocs\Cant\backend
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Security & Permissions:**
   - Ensure `storage/` and `bootstrap/cache/` directories are writable by the web server process.
   - Run `php artisan storage:link`.
   - Enforce HTTPS and configure SSL certificates.
#   C a n t  
 