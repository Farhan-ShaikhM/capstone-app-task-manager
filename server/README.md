# Task Manager API

REST API for the Task Manager app, built with Node.js, Express 5 and MongoDB (Mongoose), with JWT authentication.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| MONGO_URI | MongoDB connection string |
| PORT | Server port (default 3000) |
| JWT_SECRET | Secret used to sign tokens |
| JWT_EXPIRE | Token lifetime, e.g. `1d` (default 1 day) |
| CLIENT_URL | Frontend URL allowed by CORS |

## Scripts

| Command | Description |
|---|---|
| npm start | Start the server |
| npm run dev | Start with Nodemon (auto-restart) |
| npm run seed | Replace all data with a demo user and tasks |
| npm test | Run the Jest API tests |
| npm run test:coverage | Run tests with a coverage report |

## API

### Auth
| Method | Endpoint | Body | Auth |
|---|---|---|---|
| POST | /api/auth/register | `{ name, email, password }` | No |
| POST | /api/auth/login | `{ email, password }` | No |
| GET | /api/auth/me | – | Yes |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | List own tasks. Query: `status` (pending, in-progress, done, all), `search`, `sort` (newest, oldest, priority, title) |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update own task (403 if not the owner) |
| DELETE | /api/tasks/:id | Delete own task (403 if not the owner) |

Task body:
```json
{
  "title": "Write API tests",
  "description": "Cover auth and task routes",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-11-01"
}
```

## Security

- Passwords hashed with bcrypt and never returned in responses
- JWT required for all task routes
- Ownership check on update and delete
- `role` is ignored on registration
- Helmet security headers
- Rate limit of 20 requests per 15 minutes on auth routes
- JSON request bodies limited to 10kb

## Project Structure

```
config/        MongoDB connection
controllers/   Auth and task logic
middleware/    Auth (protect, authorize), CORS, logger, 404 and error handlers
models/        User and Task schemas
routes/        Route definitions
tests/         Jest + Supertest tests (in-memory MongoDB)
app.js         Express app setup
server.js      Entry point
seed.js        Demo data
```
