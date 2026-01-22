# Professional Java Developer Portfolio

A full-stack portfolio website built with **Spring Boot 3** (Backend) and **React/Vite** (Frontend), featuring a **PostgreSQL** database.

## 🚀 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3+**
- **Spring Security (JWT)**
- **Spring Data JPA**
- **PostgreSQL**
- **Flyway** (Database Migration)
- **MapStruct**
- **Swagger / OpenAPI**
- **Docker**

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Shadcn UI**
- **TypeScript**

## 📂 Project Structure

```
/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/com/portfolio/backend
│   │   ├── config/          # Security & App Config
│   │   ├── controller/      # REST APIs
│   │   ├── entity/          # JPA Entities
│   │   ├── repository/      # JPA Repositories
│   │   ├── service/         # Business Logic
│   │   └── ...
│   └── src/main/resources
│       └── db/migration/    # Flyway SQL Scripts
├── src/                     # React Frontend Source (Root)
│   ├── components/
│   ├── pages/
│   └── lib/api.ts           # API Integration
├── docker-compose.yml       # Orchestration
└── Dockerfile               # Backend Dockerfile
```

## 🛠️ Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose

### 1. Database & Backend (Docker)
Run the following command to start PostgreSQL and the Backend:
```bash
docker-compose up --build
```
The backend will run on `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Frontend (Local Dev)
```bash
npm install
npm run dev
```
The frontend will run on `http://localhost:8080` (or Vite default port, configurable).

## 🔌 API Endpoints (Examples)

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT Token

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (Admin only)
- `GET /api/projects/{id}` - Get project details

### Profile & Skills
- `GET /api/profile` - Get developer profile
- `GET /api/skills` - List skills

## 🔐 Security
- Public Endpoints: GET Projects, Profile, Skills.
- Protected Endpoints: All CUD operations (Create, Update, Delete) require `Bearer <token>`.
- Admin Role required for Portfolio Management.

## 🎨 UI/UX Features
- Dark Mode by default.
- Responsive design.
- Terminal-style "About Me".
- Glassmorphism effects.

## 🐳 Docker Support
The `docker-compose.yml` includes:
- **Postgres 15**: Persists data to `postgres_data` volume.
- **Backend**: Builds from `./backend`.

## 📄 License
MIT
