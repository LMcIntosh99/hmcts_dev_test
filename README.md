# Task Management App

A full-stack task management application with a **React** frontend and **Java Spring Boot** backend.  
It allows users to create, view, update, and delete tasks.

---

## Features

### Backend API (Java Spring Boot)
The backend exposes a RESTful API to manage tasks:

- **Task Properties**
  - `title` (required)
  - `description` (optional)
  - `status` (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
  - `dueDateTime` (optional)

- **API Endpoints**

| Method | Endpoint                    | Description                     |
|--------|----------------------------|---------------------------------|
| POST   | `/api/tasks`               | Create a new task               |
| GET    | `/api/tasks`               | Retrieve all tasks              |
| GET    | `/api/tasks/{id}`          | Retrieve a task by ID           |
| GET    | `/api/tasks/status/{status}` | Retrieve tasks filtered by status |
| PATCH  | `/api/tasks/{id}/status`   | Update task status              |
| PATCH  | `/api/tasks/{id}`          | Update task details             |
| DELETE | `/api/tasks/{id}`          | Delete a task                   |

- **Exception Handling**  
  Returns `TaskNotFoundException` when a task with a given ID does not exist.

---

### Frontend Application (React)
The React frontend provides a user-friendly interface:

- Create, view, update, and delete tasks
- Displays tasks by their status
- Filter tasks by status
- Update task status

---

## Tech Stack

- **Frontend:** React 19, TypeScript 4.9, Axios 1.11
- **Backend:** Java 21, Spring Boot 3.5.5, JPA/Hibernate  
- **Database:** PostgreSQL  
- **Build Tool:** Gradle  

---

## Backend Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```
2. Update application.properties with your PostgreSQL configuration:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/tasksdb
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Navigate to backend folder, then build and run the backend:
   ```bash
   cd backend
   ./gradlew bootRun
   ```

## Frontend Setup

1. Navigate to the frontend folder and install dependencies::
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Open http://localhost:3000 in your browser
