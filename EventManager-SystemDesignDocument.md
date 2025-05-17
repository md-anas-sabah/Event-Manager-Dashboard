# Event Manager System Design Document

## 1. Introduction

### 1.1 Purpose
This document outlines the comprehensive system architecture and design of the Event Manager platform—a scalable, full-stack application designed to facilitate event creation, management, and participation.

### 1.2 Scope
Event Manager provides a complete solution for digital event management, including user authentication, event lifecycle management, participant registration, and dashboard analytics. The system is designed to scale from personal events to large-scale gatherings.

### 1.3 Definitions, Acronyms, and Abbreviations
- **JWT**: JSON Web Token
- **RBAC**: Role-Based Access Control
- **CDN**: Content Delivery Network
- **SPA**: Single Page Application
- **CQRS**: Command Query Responsibility Segregation

## 2. System Architecture

### 2.1 Architectural Overview

The Event Manager application implements a modern microservices-oriented architecture with clear separation of concerns:

```
┌───────────────────────────────────────────────────────────┐
│                      Client Layer                         │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │  Web Client │  │Mobile Client│  │Progressive Web  │    │
│  │  (Next.js)  │  │   (Future)  │  │    App (PWA)    │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                   │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │ CDN/Static  │  │   API       │  │   Reverse       │    │
│  │   Assets    │  │   Gateway   │  │    Proxy        │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│                       Service Layer                       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │    Auth     │  │    Event    │  │   Participant   │    │
│  │   Service   │  │   Service   │  │     Service     │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │ Notification│  │   Search    │  │    Analytics    │    │
│  │   Service   │  │   Service   │  │     Service     │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│                       Data Layer                          │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │ PostgreSQL  │  │   Redis     │  │  Object Storage │    │
│  │  Database   │  │   Cache     │  │     (S3/Blob)   │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

### 2.2 Technical Stack

#### Frontend Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **State Management**: React Context API + Custom Hooks
- **UI Components**: Shadcn UI with Tailwind CSS
- **Form Management**: React Hook Form with Zod validation
- **API Communication**: Axios with interceptors
- **Notifications**: Sonner toast notifications
- **Authentication**: JWT-based with HttpOnly cookies

#### Backend Technology Stack
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with raw SQL queries
- **Authentication**: Custom token implementation with crypto
- **Caching Layer**: Redis (planned for future scaling)
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Jest with Supertest

#### Infrastructure Components
- **Frontend Hosting**: Vercel/Netlify
- **Backend Hosting**: Scalable container service (AWS ECS/GCP Cloud Run)
- **Database**: Managed PostgreSQL service (Supabase)
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Monitoring**: Prometheus + Grafana (future implementation)

### 2.3 Component Design and Interactions

#### 2.3.1 Frontend Component Architecture

The frontend implements a component-based architecture following atomic design principles:

```
Frontend/
├── app/                  # Next.js App Router structure
│   ├── (auth)/           # Authentication routes (login/register)
│   ├── (dashboard)/      # Protected dashboard routes
│   └── page.tsx          # Public landing page
├── components/           # Reusable UI components
│   ├── ui/               # Atomic UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API clients
└── types/                # TypeScript type definitions
```

#### 2.3.2 Backend Component Architecture

The backend follows a layered architecture with separation of concerns:

```
Backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # Data models and database operations
│   ├── routes/           # API route definitions
│   ├── middleware/       # Custom middleware functions
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Application entry point
├── tests/                # Unit and integration tests
└── config/               # Configuration files
```

## 3. Database Design

### 3.1 Entity-Relationship Diagram

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│     users         │      │     events        │      │ event_participants│
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ id [PK]           │      │ id [PK]           │      │ id [PK]           │
│ name              │◄─────┤ user_id [FK]      │      │ event_id [FK]     │
│ email [UNIQUE]    │      │ name              │◄─────┤ user_id [FK]      │
│ password          │      │ description       │      │ status            │
│ created_at        │      │ date              │      │ registered_at     │
│ updated_at        │      │ location          │      │ cancelled_at      │
└───────────────────┘      │ created_at        │      │ cancellationreason│
                           │ updated_at        │      └───────────────────┘
                           └───────────────────┘
                                    ▲
                                    │
                           ┌───────────────────┐
                           │    categories     │
                           ├───────────────────┤
                           │ id [PK]           │
                           │ name              │
                           │ description       │
                           └───────────────────┘
```

### 3.2 Database Schema Definition

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Event Participants Table
```sql
CREATE TABLE event_participants (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  UNIQUE(event_id, user_id)
);
```

#### Categories Table (Future Enhancement)
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE event_categories (
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);
```

### 3.3 Database Indexing Strategy

To optimize query performance, the following indexes are implemented:

```sql
-- Users email lookup
CREATE INDEX idx_users_email ON users(email);

-- Events by user search
CREATE INDEX idx_events_user_id ON events(user_id);

-- Events date search/sort
CREATE INDEX idx_events_date ON events(date);

-- Event participants filter
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX idx_event_participants_status ON event_participants(status);
```

### 3.4 Query Optimization

The application uses parameterized raw SQL queries with careful consideration for performance:

- Complex joins are minimized and broken into separate queries when appropriate
- COUNT(*) operations use optimized index-only scans
- Text search uses PostgreSQL's full-text search capabilities

## 4. API Design

### 4.1 RESTful API Endpoints

The API follows RESTful principles with consistent patterns:

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user and issue token
- `POST /api/auth/logout` - Invalidate user's token
- `GET /api/auth/profile` - Get current user's profile

#### Event Endpoints
- `GET /api/events` - List all events (with filtering/pagination)
- `GET /api/events/:id` - Get specific event details
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update existing event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/user/events` - Get events created by current user

#### Participant Endpoints
- `POST /api/events/:id/register` - Register for an event
- `GET /api/events/:id/participants` - Get all participants for an event
- `PUT /api/events/:eventId/participants/:userId/cancel` - Cancel participation
- `GET /api/user/participating` - Get events user is participating in

### 4.2 API Request/Response Format

All API endpoints follow a consistent request/response format:

#### Example Request
```json
POST /api/events
Content-Type: application/json
Authorization: Bearer 

{
  "name": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-09-15",
  "location": "San Francisco, CA"
}
```

#### Example Response
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 123,
  "name": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-09-15",
  "location": "San Francisco, CA",
  "user_id": 456,
  "created_at": "2025-05-18T10:30:00Z"
}
```

### 4.3 Error Handling

The API implements standardized error responses:

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": "Invalid event data",
  "errors": [
    {
      "field": "date",
      "message": "Date must be in the future"
    }
  ]
}
```

Error status codes follow HTTP standards:
- `400` - Bad Request (client error, validation failures)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error (unexpected server issues)

## 5. Authentication and Authorization

### 5.1 Authentication Flow

The application implements secure token-based authentication:

1. **Registration Flow**:
   - User submits registration credentials
   - Server validates input and checks for existing email
   - Password is hashed using bcrypt with salt
   - User record is created in database
   - JWT token is generated and returned
   - Token is stored in both HttpOnly cookie and localStorage

2. **Login Flow**:
   - User submits email/password
   - Server verifies credentials against database
   - If valid, JWT token is generated and returned
   - Token includes user ID and role information
   - Token expiration is set to 7 days

3. **Authentication Verification**:
   - Protected endpoints check for valid token
   - Token is validated for integrity and expiration
   - User information is attached to request object

### 5.2 Authorization Model

The application implements role-based access control (RBAC):

- **Public Access**: Unauthenticated users can view public event listings
- **User Role**: Can create events, manage own events, register for events
- **Event Owner**: Special permissions for events they've created
- **Admin Role**: Full system access (future enhancement)

### 5.3 Security Considerations

- **Password Security**: Passwords stored using bcrypt with appropriate work factor
- **CSRF Protection**: Implemented via SameSite cookies and CSRF tokens
- **XSS Prevention**: Content sanitization and CSP headers
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Protection**: Parameterized queries and input sanitization

## 6. Frontend Design

### 6.1 UI/UX Design Principles

The user interface follows modern design principles:

- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: WCAG 2.1 AA compliance with semantic HTML
- **Consistency**: Unified design system with consistent patterns
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Performance**: Optimized loading and rendering performance

### 6.2 State Management

The application implements a hybrid state management approach:

- **Local Component State**: For UI-specific state
- **Context API**: For shared application state (auth, theme)
- **Server State**: For data fetching and mutations
- **URL State**: For filter parameters and navigation
- **Form State**: Managed via React Hook Form

### 6.3 User Flows

#### Core User Flows:

1. **User Registration/Login**:
   - User visits site → Clicks Register/Login → Completes form → Redirected to dashboard

2. **Event Creation**:
   - User logs in → Navigates to "Create Event" → Completes form → Event is created

3. **Event Registration**:
   - User browses events → Views event details → Clicks "Register" → Confirmation displayed

4. **Event Management**:
   - User navigates to "My Events" → Views event → Manages participants or edits details

## 7. Performance Optimization

### 7.1 Frontend Optimizations

- **Code Splitting**: Dynamic imports for route-based code splitting
- **Image Optimization**: Next.js image optimization with responsive sizes
- **CSS Optimization**: Tailwind with PurgeCSS to minimize CSS bundle
- **Caching Strategy**: SWR for API data caching with stale-while-revalidate
- **Bundle Analysis**: Regular analysis to minimize JavaScript payload

### 7.2 Backend Optimizations

- **Query Optimization**: Efficient SQL queries with proper indexing
- **Connection Pooling**: Database connection pool management
- **Caching Layer**: Response caching for frequently accessed data
- **Compression**: gzip/brotli compression for API responses
- **Rate Limiting**: Prevent abuse through tiered rate limiting

### 7.3 Database Optimizations

- **Indexing Strategy**: Strategic indexes for common query patterns
- **Query Optimization**: Explain/analyze for complex queries
- **Connection Pooling**: Efficient connection management
- **Vertical Partitioning**: For future scaling of large tables

## 8. Scalability Considerations

### 8.1 Horizontal Scaling

The architecture supports horizontal scaling through:

- **Stateless Services**: Backend services designed to be stateless
- **Load Balancing**: Traffic distribution across multiple instances
- **Distributed Caching**: Shared Redis cache for session data
- **Database Replication**: Read replicas for scaling read operations

### 8.2 Vertical Scaling

- **Resource Optimization**: Efficient use of compute resources
- **Database Scaling**: Strategic upgrades of database instances
- **Memory Management**: Optimized memory usage for high-traffic scenarios

### 8.3 Future Scaling Strategy

For handling increased load, the system is designed to scale through:

1. **Microservice Decomposition**: Breaking monolithic API into specialized services
2. **CQRS Pattern**: Separate read and write operations for high-traffic scenarios
3. **Event Sourcing**: For complex data evolution and audit capabilities
4. **Serverless Functions**: For specific high-scale, ephemeral workloads

## 9. Monitoring and Observability

### 9.1 Logging Strategy

- **Structured Logging**: JSON-formatted logs with consistent schema
- **Log Levels**: Appropriate use of debug, info, warn, error levels
- **Contextual Information**: Request IDs and user context in logs
- **Log Aggregation**: Centralized log collection and analysis

### 9.2 Metrics and Monitoring

Key system metrics to monitor:

- **Request Rate**: Requests per second, by endpoint
- **Error Rate**: Percentage of failed requests
- **Response Time**: P50, P95, P99 latency metrics
- **Database Performance**: Query execution time and connection pool usage
- **Resource Utilization**: CPU, memory, disk usage

### 9.3 Alerting

- **SLA Alerts**: Alerts for breaches of service level agreements
- **Error Rate Thresholds**: Alerts for unusual error rates
- **Resource Thresholds**: Alerts for high resource utilization
- **Security Alerts**: Unusual access patterns or potential attacks

## 10. Deployment Strategy

### 10.1 CI/CD Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   Code   │     │   Build  │     │   Test   │     │ Deploy   │
│  Commit  │────►│  Process │────►│  Suite   │────►│ Process  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
┌──────────┐     ┌──────────┐     ┌──────────┐          │
│ Monitor  │◄────│ Production│◄───│ Staging  │◄────────-┘
│          │     │           │    │          │
└──────────┘     └──────────┘     └──────────┘
```

The continuous integration and deployment pipeline:

1. **Code Commit**: Developer pushes changes to repository
2. **Build Process**: Automated build triggered on commit
3. **Test Suite**: Unit, integration, and end-to-end tests run
4. **Quality Gates**: Code quality and security scanning
5. **Staging Deployment**: Automatic deployment to staging environment
6. **Production Deployment**: Manual approval for production deployment
7. **Monitoring**: Post-deployment monitoring and alerting

### 10.2 Environment Strategy

- **Development**: Local development environment with hot reloading
- **Testing**: Isolated environment for automated tests
- **Staging**: Production-like environment for final testing
- **Production**: Live environment with scaled resources

### 10.3 Rollback Strategy

- **Versioned Deployments**: All deployments are versioned
- **Blue/Green Deployment**: Zero-downtime deployment strategy
- **Automated Rollback**: Triggered by monitoring alerts
- **Database Migrations**: Forward and reverse migrations for schema changes

## 11. Security Considerations

### 11.1 Data Security

- **Encryption at Rest**: Database encryption for sensitive data
- **Encryption in Transit**: TLS for all communications
- **Secure Credentials**: Environment variables for secrets
- **Data Retention**: Clear policies for data retention and deletion

### 11.2 Application Security

- **Input Validation**: Comprehensive validation on all inputs
- **Output Encoding**: Context-appropriate output encoding
- **CSRF Protection**: Anti-CSRF tokens for state-changing operations
- **Content Security Policy**: Restrictive CSP headers
- **Security Headers**: Implementation of recommended security headers

### 11.3 Infrastructure Security

- **Network Security**: Proper network segmentation
- **Firewall Rules**: Restrictive firewall configuration
- **Secret Management**: Secure handling of credentials and secrets
- **Dependency Scanning**: Regular scanning for vulnerable dependencies

## 12. Future Enhancements

### 12.1 Technical Roadmap

- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Progressive Web App with offline capabilities
- **Mobile Applications**: Native mobile apps for iOS and Android
- **Advanced Analytics**: Enhanced analytics dashboard for event organizers
- **AI Features**: Smart recommendations and insights

### 12.2 Feature Roadmap

1. **Enhanced Event Types**: Support for virtual and hybrid events
2. **Payment Integration**: Paid events with payment processing
3. **Advanced Notifications**: Email and push notifications
4. **Social Features**: Social sharing and attendee networking
5. **Calendar Integration**: Google/Outlook calendar integration

## 13. Appendix

### 13.1 Technology Selection Rationale

| Technology | Selected Option | Rationale |
|------------|-----------------|-----------|
| Frontend Framework | Next.js | Server-side rendering capabilities, robust ecosystem, excellent developer experience |
| CSS Framework | Tailwind CSS | Utility-first approach, high customizability, excellent responsive design support |
| Backend Framework | Express.js | Lightweight, flexible, extensive middleware ecosystem |
| Database | PostgreSQL | Robust, ACID-compliant, excellent support for complex queries and JSON operations |
| ORM/Query Builder | Raw SQL | Direct control over queries, no ORM overhead, better performance optimizations |
| Authentication | Custom JWT | Full control over authentication flow, integration with existing user database |

### 13.2 API Reference Documentation

Complete API documentation available in OpenAPI format at `/api/docs` endpoint.

### 13.3 Development Guidelines

- **Coding Standards**: TypeScript strict mode, ESLint with recommended rules
- **Testing Requirements**: Unit tests for all business logic, integration tests for API endpoints
- **Git Workflow**: GitHub Flow with feature branches and pull requests
- **Review Process**: Code review required before merging to main branch