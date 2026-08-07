# MF Chikankari

A full-stack e-commerce platform for showcasing and managing Chikankari products, customer accounts, wholesale workflows, inventory, categories, and orders.

The project includes a customer-facing React storefront and a Node.js/Express backend with PostgreSQL, Prisma, JWT authentication, role-based authorization, and an admin management interface.

## Live Demo

**Frontend:** https://mf-chikankari-showcase-rocs.vercel.app/

**Backend API:** https://mf-chikankari-api.onrender.com

## Features

### Customer Storefront

* Responsive product storefront
* Product listing and product detail pages
* Category-based product browsing
* Search, filtering, and sorting
* Shopping cart with quantity management
* Cart persistence using local storage
* Checkout interface
* Customer signup and login
* JWT-based authentication
* Account page
* Forgot-password interface
* Wholesale registration flow
* Responsive layouts for desktop and mobile

### Admin Dashboard

* Admin authentication
* Product management
* Add and edit products
* Category management
* Inventory management
* Product variant management
* Stock restocking and manual stock adjustments
* Inventory history
* Order management
* Customer management
* Wholesale account management
* Product image upload support

### Backend

* REST API built with Express
* PostgreSQL database
* Prisma ORM
* JWT access and refresh tokens
* Role-based authorization
* Request validation using Zod
* Password hashing using bcrypt
* CORS configuration
* Security headers using Helmet
* API rate limiting
* Cloudinary image integration
* Centralized error handling

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* React Hook Form
* Zod
* Framer Motion
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* PostgreSQL
* Prisma
* JWT
* bcrypt
* Zod
* Cloudinary
* Multer
* Helmet
* Express Rate Limit

### Infrastructure

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Neon PostgreSQL
* **Media:** Cloudinary

## Architecture

The project uses a frontend/backend structure inside a single Git repository.

```text
mf-chikankari-showcase/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── schemas/
│   ├── sections/
│   ├── services/
│   └── types/
│
├── server/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── lib/
│       ├── middlewares/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── .env.example
├── package.json
└── README.md
```

The frontend communicates with the backend through a REST API.

The backend follows a layered structure:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

## API Modules

The backend currently contains API modules for:

* Authentication
* Products
* Categories
* Inventory
* Orders
* Users
* Wholesale accounts
* File uploads

## Local Development

### Requirements

Install the following before running the project locally:

* Node.js
* npm
* PostgreSQL or a PostgreSQL-compatible cloud database

### 1. Clone the repository

```bash
git clone https://github.com/knight110599/mf-chikankari-showcase.git
cd mf-chikankari-showcase
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

## Environment Variables

Never commit real credentials or production secrets to Git.

Use the included `.env.example` files as templates.

### Frontend

Create:

```text
.env
```

Example:

```env
VITE_API_URL="http://localhost:5000/api"
```

### Backend

Create:

```text
server/.env
```

Example configuration:

```env
NODE_ENV=development
PORT=5000

CLIENT_URL=http://localhost:5173

DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

Use secure random values for production secrets.

## Database Setup

From the `server` directory:

```bash
npx prisma generate
```

Run migrations:

```bash
npm run prisma:migrate
```

Optional database browser:

```bash
npm run prisma:studio
```

Optional seed:

```bash
npm run seed
```

## Running Locally

### Backend

From:

```text
server/
```

Run:

```bash
npm run dev
```

The default backend URL is:

```text
http://localhost:5000
```

### Frontend

From the project root:

```bash
npm run dev
```

The default Vite development URL is:

```text
http://localhost:5173
```

## Production Builds

### Frontend

```bash
npm run build
```

### Backend

```bash
cd server
npm run build
npm start
```

## Code Quality

Frontend and project-level linting:

```bash
npm run lint
```

The repository is configured to exclude dependencies, generated Prisma output, and production build artifacts from linting and version control.

## Deployment

### Frontend — Vercel

The React/Vite frontend is deployed on Vercel.

Production environment variable:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend — Render

The Express API is deployed on Render.

Production secrets and database credentials are configured through Render environment variables and are not stored in the repository.

### Database — Neon PostgreSQL

The backend connects to a managed Neon PostgreSQL database through the `DATABASE_URL` environment variable.


## Security

This project follows several production-oriented security practices:

* Environment variables are excluded from version control
* JWT-based authentication
* Role-based authorization
* Password hashing with bcrypt
* Helmet security headers
* API rate limiting
* Request validation using Zod
* CORS configuration
* Centralized backend error handling
* Sensitive credentials are configured through deployment environment variables

## Current Status

The application is actively being developed and improved.

The current repository includes the main storefront, authentication system, product and category management, inventory workflows, order management, wholesale workflows, and deployment configuration.

Performance optimization, additional automated testing, and further production hardening are planned as ongoing improvements.

## Author

Developed as a full-stack e-commerce project using React, TypeScript, Node.js, Express, PostgreSQL, and Prisma.
