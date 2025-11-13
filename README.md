# Roxiler

# Rating Platform – Full Stack Coding Challenge

A full-stack web application where **Users** can rate stores, **Store Owners** can manage their own stores and see who rated them, and **Admins** can manage users and stores with filters, sorting and pagination.

This project is built specifically for a coding challenge and aims to look and behave like a small production-ready system.

---

## 🚀 Features

### 👤 Authentication & Roles

- Email/password authentication with **JWT**.
- Password rules enforced:
  - 8–16 characters
  - At least one uppercase letter
  - At least one special character.
- Role-based access control:
  - `ADMIN`
  - `USER`
  - `OWNER`
- Persistent login using JWT stored on the client (stays logged in after refresh).
- Protected routes on the frontend per role.

### 👨‍💻 User (Normal User)

- Signup with validation (name, email, address, password).
- Login and access **User Stores** page.
- View paginated list of stores.
- Filter stores by **name** and **address**.
- See **overall average rating** per store.
- Rate stores from **1 to 5** (create or update their rating).
- See their own rating per store.

### 🏪 Store Owner

- Owner Dashboard with:
  - Total number of **owned stores**.
  - Total **ratings** received.
  - Overall **average rating**.
- Paginated list of owned stores with:
  - Store name, address.
  - Average rating and total rating count.
- Create new stores.
- Edit existing stores (name, email, address).
- View **users who rated** a particular store, with:
  - User name, email.
  - Rating value.
- (Optional in UI) Delete own stores (if enabled) – ratings for that store are also removed.

### 🛠 Admin

- Admin Dashboard with global stats:
  - Total users.
  - Total stores.
  - Total ratings.
- **Users Management**
  - Paginated list of users.
  - Filter by name, email, address, role.
  - Sort by name, email, address, role.
  - Delete non-admin users (and their ratings).
- **Stores Management**
  - Paginated list of stores.
  - Filter by name, email, address.
  - Sort by name, email, address, rating.
  - Create stores and assign owner by email.
  - Edit existing stores (including changing owner).
  - Delete stores (and their ratings).

### 💾 Data & Persistence

- Real database: **MySQL**.
- Tables:
  - `users` – user details + hashed password + role.
  - `stores` – stores with optional owner.
  - `ratings` – link between users & stores with rating value.
- On startup, backend seeds:
  - **Admin**: `admin@example.com` / `Admin@123`
  - **Owner**: `owner@example.com` / `Owner@123`

### 🎨 UI / UX

- Clean, minimal, recruiter-friendly UI.
- Consistent card layout, spacing, and typography.
- Separate layouts per role:
  - `AdminLayout`
  - `OwnerLayout`
  - `UserLayout`
- Reusable components:
  - `Table`
  - `Button`
  - `Input`
  - `RatingStars`
- Pagination with Previous / Next for:
  - User → Stores list
  - Admin → Users list
  - Admin → Stores list
  - Owner → Stores list

---

## 🧱 Tech Stack

**Frontend**

- React (SPA)
- React Router
- Axios (API client)
- Custom UI components (no heavy UI framework to keep it simple)

**Backend**

- Node.js
- Express
- MySQL (via `mysql2` / connection pool)
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Environment variables (`dotenv`)

---

## 📁 Project Structure (High Level)

```bash
.
├── backend
│   ├── package.json
│   ├── src
│   │   ├── server.js
│   │   ├── config
│   │   │   └── db.js
│   │   ├── middleware
│   │   │   └── authMiddleware.js
│   │   ├── models
│   │   │   ├── User.js
│   │   │   ├── Store.js
│   │   │   └── Rating.js
│   │   ├── controllers
│   │   │   ├── auth.controller.js
│   │   │   ├── store.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── owner.controller.js
│   │   └── routes
│   │       ├── auth.routes.js
│   │       ├── store.routes.js
│   │       ├── admin.routes.js
│   │       └── owner.routes.js
│   └── .env
└── frontend
    ├── package.json
    └── src
        ├── App.jsx
        ├── router/AppRouter.jsx
        ├── api/client.js
        ├── context/AuthContext.jsx
        ├── components
        │   ├── Layout
        │   │   ├── AdminLayout.jsx
        │   │   ├── OwnerLayout.jsx
        │   │   └── UserLayout.jsx
        │   └── UI
        │       ├── Button.jsx
        │       ├── Input.jsx
        │       ├── Table.jsx
        │       └── RatingStars.jsx
        └── pages
            ├── auth
            │   ├── LoginPage.jsx
            │   └── SignupPage.jsx
            ├── admin
            │   ├── AdminDashboardPage.jsx
            │   ├── AdminUsersPage.jsx
            │   └── AdminStoresPage.jsx
            ├── owner
            │   └── OwnerDashboardPage.jsx
            └── user
                └── UserStoresPage.jsx


⚙️ Backend – Setup & Run
    1. Install dependencies
        cd backend
        npm install

2. Create MySQL database
    Open MySQL Workbench or CLI and create a database:
        CREATE DATABASE rating_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3. Configure environment variables
    Create a .env file inside backend:
        PORT=4000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=YOUR_PASSWORD_HERE
        DB_NAME=rating_app

        JWT_SECRET=some-super-secret-key
        CORS_ORIGIN=http://localhost:5173

4. Create tables
    Run the following SQL to create tables:
        USE rating_app;

        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(400),
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('ADMIN','USER','OWNER') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        address VARCHAR(400),
        owner_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_store_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_rating_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        CONSTRAINT uc_user_store UNIQUE (user_id, store_id)
        );


5. Seed admin & owner users

The backend automatically ensures two default users on startup:

Admin
Email: admin@example.com
Password: Admin@123

Owner
Email: owner@example.com
Password: Owner@123

6. Start backend server
npm run dev
    By default it runs on: http://localhost:4000


💻 Frontend – Setup & Run
    1. Install dependencies
        cd frontend
        npm install
        npm run dev
    Usually this runs at: http://localhost:5173


🔐 Authentication & Roles (How to Use)
Default accounts

Admin - 
    Email: admin@example.com
    Password: Admin@123

Owner - 
    Email: owner@example.com
    Password: Owner@123

Typical flows
User
Click "Sign up" → create a user account.
Log in → browse stores → filter → rate 1–5.

Owner
Log in as owner@example.com.
Open Owner Dashboard → add/edit stores → see ratings and raters.

Admin
Log in as admin@example.com.
Use Admin Dashboard → see stats, manage users and stores, delete where needed.

🌐 API Overview (High Level)

All protected routes require Authorization: Bearer <token> header.

Auth

POST /api/auth/signup – create a normal USER.

POST /api/auth/login – returns { token, user }.

User

GET /api/stores – list stores for the logged-in user (filters + pagination).

POST /api/ratings/:storeId – create or update rating for a store.

Admin

GET /api/admin/dashboard – global stats.

GET /api/admin/users – list users (filters, sort, pagination).

DELETE /api/admin/users/:userId – delete user and their ratings.

GET /api/admin/stores – list stores (filters, sort, pagination).

POST /api/admin/stores – create store (optionally assign owner by email).

PUT /api/admin/stores/:storeId – update store.

DELETE /api/admin/stores/:storeId – delete store and related ratings.

Owner

GET /api/owner/dashboard – stats for owned stores.

GET /api/owner/stores – list owned stores (pagination).

GET /api/owner/stores/:storeId/raters – list users who rated a store.

POST /api/owner/stores – create owned store.

PUT /api/owner/stores/:storeId – update owned store.

DELETE /api/owner/stores/:storeId – delete owned store + its ratings.



