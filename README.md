# Task Manager

![CI](https://github.com/Farhan-ShaikhM/capstone-app/actions/workflows/ci.yml/badge.svg)

A full-stack MERN task manager with secure user accounts. Users register and log in with JWT authentication, then create, update, filter, search and sort their own tasks. The backend is covered by automated API tests that run on every push through GitHub Actions.

<!-- Add a screenshot of the dashboard and uncomment the line below -->
<!-- ![Dashboard](client/public/screenshot.png) -->

## Features

**Accounts and security**
- Register and log in with JWT authentication; passwords hashed with bcrypt
- Protected API routes and protected frontend routes
- Users can only view, edit or delete their own tasks (ownership checks return 403)
- Role field cannot be set by the client, preventing self-registration as admin
- Security headers with Helmet, rate limiting on login/register, and a 10kb request size limit

**Tasks**
- Create, update and delete tasks with title, description, priority, status and due date
- Filter by status (pending, in-progress, done)
- Case-insensitive search across title and description
- Sort by newest, oldest, priority or title

**Quality**
- 31 API tests with Jest and Supertest, using an in-memory MongoDB
- GitHub Actions CI runs backend tests, frontend linting and a production build on every push
- Validation on both frontend and backend, with centralised error handling

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Context API |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth & security | JWT, bcrypt, Helmet, express-rate-limit |
| Testing & CI | Jest, Supertest, mongodb-memory-server, GitHub Actions, ESLint |

## Project Structure

```
client/                 React + Vite frontend
  src/api/              Axios instance (adds the JWT, handles 401s)
  src/components/       Task form, list, card, filter bar, protected route
  src/context/          Auth and toast state
  src/pages/            Login, Register, Dashboard
  src/utils/            Form validation
server/                 Express REST API
  config/               MongoDB connection
  controllers/          Auth and task logic
  middleware/           Auth, CORS, logging, 404 and error handlers
  models/               User and Task schemas
  routes/               API route definitions
  tests/                Jest + Supertest API tests
  app.js                Express app (middleware and routes)
  server.js             Entry point (connects DB, starts server)
  seed.js               Demo data
.github/workflows/      CI pipeline
```

## Getting Started

### Prerequisites
- Node.js 20 or later
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Clone the repository
```bash
git clone https://github.com/Farhan-ShaikhM/capstone-app.git
cd capstone-app
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env      # then fill in your values
npm run seed              # optional: demo user + sample tasks
npm run dev
```
The API runs at http://localhost:3000.

Demo login after seeding: `demo@example.com` / `demo123`

### 3. Frontend
In a new terminal:
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
The app opens at http://localhost:5173.

## Running Tests

```bash
cd server
npm test                  # run all API tests
npm run test:coverage     # with a coverage report
```

Tests start a temporary in-memory MongoDB, so no database setup is needed and real data is never touched.

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/health | Health check | No |
| POST | /api/auth/register | Register, returns a JWT | No |
| POST | /api/auth/login | Log in, returns a JWT | No |
| GET | /api/auth/me | Current user | Yes |
| GET | /api/tasks | List own tasks (`?status=`, `?search=`, `?sort=`) | Yes |
| POST | /api/tasks | Create a task | Yes |
| PUT | /api/tasks/:id | Update own task | Yes |
| DELETE | /api/tasks/:id | Delete own task | Yes |

Protected routes need the header `Authorization: Bearer <token>`. More detail is in [server/README.md](server/README.md).

## Future Improvements

- Pagination for large task lists
- Admin dashboard using the existing role-based `authorize` middleware
- Frontend component tests with React Testing Library
- Deployment of frontend and backend

## Contributors

- Farhan Shaikh – [GitHub](https://github.com/Farhan-ShaikhM)
- [gitsaudk](https://github.com/gitsaudk)
