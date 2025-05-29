# HireBuddy Challenge

A full-stack application built with Next.js (frontend) and Node.js (backend) to help streamline the hiring process.

## 🚀 Features

- Modern, responsive user interface
- Real-time updates
- Secure authentication
- RESTful API architecture
- Database integration

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Git

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/yourusername/hirebuddy-challenge.git
cd hirebuddy-challenge
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at [http://localhost:3000](http://localhost:3000)

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend server will start at [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
hirebuddy-challenge/
├── frontend/           # Next.js frontend application
│   ├── app/           # App router pages and components
│   ├── public/        # Static assets
│   └── ...
├── backend/           # Node.js backend application
│   ├── src/          # Source code
│   ├── prisma/       # Database schema and migrations
│   └── ...
└── README.md
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hirebuddy"
JWT_SECRET="your-secret-key"
PORT=8000
```

## 🧪 Running Tests

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```
