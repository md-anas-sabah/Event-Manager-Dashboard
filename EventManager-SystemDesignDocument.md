The application follows a client-server architecture with a clear separation between frontend and backend:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Frontend     │       │     Backend     │       │    Database     │
│  (Next.js App)  │◄─────►│  (Express API)  │◄─────►│  (PostgreSQL)   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### 2.2 Component Architecture

#### Frontend (Next.js):

- **App Router**: For page routing and navigation
- **Components**: Reusable UI elements (EventCard, EventForm, etc.)
- **Context API**: For global state management (auth state)
- **API Client**: Axios-based service for backend communication
- **Form Validation**: Zod schema validation

#### Backend (Express.js):

- **Controllers**: Handle request processing logic
- **Models**: Handle database interactions with raw SQL
- **Routes**: Define API endpoints
- **Middleware**: Authentication, error handling, etc.
- **Utils**: Helper functions and utilities

## 3. Database Schema

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────-┐
│      users        │      │      events       │      │ event_participants │
├───────────────────┤      ├───────────────────┤      ├───────────────────-┤
│ id (PK)           │      │ id (PK)           │      │ id (PK)            │
│ name              │      │ name              │      │ event_id (FK)      │
│ email             │      │ description       │      │ user_id (FK)       │
│ password          │      │ date              │      │ status             │
│ created_at        │      │ location          │      │ registered_at      │
└───────────────────┘      │ user_id (FK)      │      │ cancelled_at       │
                           │ created_at        │      │ cancellation_reason│
                           └───────────────────┘      └───────────────────-┘
```

## 4. API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/user/events` - Get user's events

### Participants

- `POST /api/events/:id/register` - Register for an event
- `GET /api/events/:id/participants` - Get event participants
- `PUT /api/events/:eventId/participants/:userId/cancel` - Cancel registration
- `GET /api/user/participating` - Get events user is participating in

## 5. Authentication Flow

The application uses token-based authentication:

1. User registers/logs in and receives a JWT token
2. Token is stored in localStorage and set as a cookie
3. Token is included in subsequent requests via Authorization header
4. Token is verified on the server for protected routes
5. Token expires after a configured time period (7 days)

## 6. Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are signed with a secret key
- CORS is configured to restrict API access
- Input validation is performed on both client and server
- SQL injection protection with parameterized queries

## 7. Deployment Strategy

### Frontend:

- Build the Next.js application for production
- Host on Vercel, Netlify, or any static hosting service

### Backend:

- Compile TypeScript to JavaScript
- Deploy to a Node.js hosting platform (Heroku, Render, etc.)
- Set up environment variables for configuration

### Database:

- Use a managed PostgreSQL service (Supabase, Neon, etc.)
- Set up proper backups and monitoring
