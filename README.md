# 🐠 Exotic Fish Mart

Premium e-commerce platform for exotic aquarium fish with 3D interactive homepage, admin dashboard, cart, wishlist, and review system.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **3D Engine** | Three.js (React Three Fiber + Drei) |
| **Animations** | Framer Motion |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Docker Compose |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
cd exotic-fish-mart

# Install frontend
cd frontend && npm install

# Install backend
cd ../backend && npm install
```

### 2. Start MongoDB
Make sure MongoDB is running locally on port 27017, or set `MONGODB_URI` in `backend/.env`.

### 3. Seed the Database

```bash
cd backend
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:3000** in your browser.

## 🔑 Admin Access

- URL: `/admin`
- Email: `admin@exoticfish.com`
- Password: `admin123`

## 📡 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products?category=Rare` | Filter by category |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products/:id/reviews` | Add review |
| GET | `/api/health` | Health check |

### Admin (Protected — JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/products` | List products |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |

## 🐳 Docker

```bash
docker-compose up -d
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000  
MongoDB: localhost:27017

## 🌟 Features

- **3D Aquarium Scene** — Animated fish, bubbles, coral, underwater lighting
- **Product Catalog** — Category filters, search, ratings
- **Shopping Cart** — Slide-out drawer, quantity controls, localStorage persistence
- **Wishlist** — Save favorites, localStorage persistence
- **Review System** — Star ratings + comments per product
- **Admin Dashboard** — Full CRUD, stats, JWT-protected
- **Responsive Design** — Mobile-first, glassmorphic UI
- **Premium Animations** — Framer Motion throughout

## 📁 Project Structure

```
exotic-fish-mart/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/        # Admin Login & Dashboard
│   │   │   ├── AquariumScene.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── Products.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── ...config files
├── backend/
│   ├── models/Product.js
│   ├── routes/products.js
│   ├── routes/admin.js
│   ├── middleware/auth.js
│   ├── server.js
│   └── seed.js
└── docker-compose.yml
```
