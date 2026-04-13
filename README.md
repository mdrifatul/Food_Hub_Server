# Food Hub API 🍲

A robust, professional-grade backend server for **Food Hub**, a multi-vendor food delivery and management platform. Built with **Node.js**, **TypeScript**, and **Prisma**, this API ensures secure, fast, and scalable operations for users, providers, and administrators.
---
## 🔗 Live URLs

- **Live Application**: [https://foodhub-client-nu.vercel.app]
- **Frontend Repository**: [https://github.com/mdrifatul/Food_Hub_Client]

## 🚀 Features

- **🔒 Secure Authentication**: Integrated with [Better Auth](https://better-auth.com/), supporting password-based and **Google OAuth** login.
- **🏢 Multi-Vendor Architecture**: Separate logic for Users (Customers) and Providers (Sellers).
- **🍛 Meal Management**: CRUD operations for meals, categories, and dynamic filtering.
- **🛒 Order System**: Real-time order processing, tracking, and management.
- **💳 Payment Integration**: Fully integrated with **Stripe** for secure transactions, including automated webhook handling.
- **⭐ Review System**: Customers can leave reviews and ratings for meals.
- **📧 Email Notifications**: Automated emails via **Nodemailer** for order confirmations and auth events.
- **🏗️ Database Management**: Type-safe database queries using **Prisma** with PostgreSQL.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth (v1)
- **Payments**: Stripe
- **Emailing**: Nodemailer
- **Deployment**: Optimized for Vercel / Node platforms

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/foodhub_server.git
cd foodhub_server
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and configure it based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/foodhub?schema=public"
PORT=5000
APP_URL=http://localhost:3000

BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_secret

APP_USER=your_email@gmail.com
APP_PASS=your_app_password

GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Database Migration

```bash
pnpm run migrate
```

### 5. Generate Prisma Client

```bash
pnpm run generate
```

### 6. Run the Server

```bash
pnpm run dev
```

---

## 📜 Available Scripts

- `pnpm dev`: Runs the development server with hot-reload.
- `pnpm migrate`: Syncs the database schema with Prisma.
- `pnpm generate`: Generates the Prisma Client.
- `pnpm seed:admin`: Seeds an initial admin user.
- `pnpm build`: Compiles TypeScript for production.
- `pnpm stripe:webhook`: Starts a local listener for Stripe Webhook events.

---

## 🔌 API Endpoints (Prefix: `/api`)

| Module         | Endpoint      | Description                                  |
| :------------- | :------------ | :------------------------------------------- |
| **Auth**       | `/auth/*`     | Better Auth endpoints (login, signup, oauth) |
| **Meals**      | `/meals`      | Get, Create, Update, Delete meals            |
| **Orders**     | `/orders`     | Place and manage customer orders             |
| **Providers**  | `/providers`  | Manage provider profiles and services        |
| **Categories** | `/categories` | Manage food categories                       |
| **Payments**   | `/payments`   | Checkout sessions and transaction history    |
| **Reviews**    | `/reviews`    | Submit and retrieve meal reviews             |

---

## 🤝 Contributing

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
