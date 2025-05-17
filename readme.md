# Event Manager Dashboard

A full-stack event management application with features for creating, managing, and participating in events.

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form with Zod Validation
- Axios
- Sonner for toast notifications

### Backend

- Express.js
- TypeScript
- PostgreSQL (raw SQL)
- JWT Authentication
- Supabase for PostgreSQL hosting

## Features

- User authentication (register, login, logout)
- Create, view, edit, and delete events
- Apply event filters and search
- Register for events
- View and manage event participants
- Dashboard with event statistics
- Responsive UI

## Project Structure

```
event-manager/
├── frontend/              # Next.js app
│   ├── app/               # App router structure
│   ├── components/        # UI components
│   ├── context/           # React Context
│   ├── lib/               # API & utilities
│   └── types/             # TypeScript types
└── backend/               # Express.js API
    ├── controllers/       # Route controllers
    ├── models/            # Database models/queries
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    └── utils/             # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud-based like Supabase)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL database credentials. If using Supabase:

   - Go to your Supabase project dashboard
   - Navigate to Project Settings → Database
   - Get the connection string and credentials

5. Set up the database tables:

   - Copy the SQL from `src/utils/schema.sql`
   - Run it in your PostgreSQL database or Supabase SQL editor

6. Start the backend development server:

```bash
npm run dev
```

The backend server will run on http://localhost:5000 by default.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:

```bash
npm run dev
```

The frontend application will run on http://localhost:3000.

## Additional Information

### Database Setup with Supabase

1. Create a Supabase account and project
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy the content from `backend/src/utils/schema.sql`
4. Run the SQL query to create all necessary tables
5. Update your backend `.env` file with Supabase credentials

### Authentication

The application uses JWT-based authentication:

- Tokens are stored in HTTP-only cookies and localStorage
- Sessions expire after 7 days by default
- Protected routes require valid authentication

### Available Scripts

Backend:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Run production server

Frontend:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Run production server
- `npm run lint`: Run ESLint

## Bonus Features Implemented

1. ✅ Form Validation with Zod
2. 🔍 Filtering Events by name, date, and location
3. 📅 Event sorting by date
4. ♻️ Edit Event functionality
5. 🧪 API Error Handling with toast notifications
6. 🔐 Authentication with JWT and HTTP-only cookies
