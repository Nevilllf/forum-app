# Full-Stack Forum Application

This is a full-stack forum-style web application built using **React**, **Node.js (Express)**, and **MySQL**. The app allows users to register, post messages, add threaded replies, vote on content, manage their profiles, explore other users, and perform administrative tasks.

## Features

- User registration and login with JWT authentication
- Channels to organize posts by topics
- Threaded/nested replies
- Like and dislike system for posts and replies
- Global search bar (posts, users, replies)
- Profile management (update avatar, name, and bio)
- Public User Explorer with sortable statistics (likes, posts, replies)
- Admin panel to view and delete users, posts, replies, and channels
- Secure upload of screenshots and profile pictures
- Dockerized setup for consistent development and deployment

## Technologies Used

### Frontend

- React 19 with Vite
- React Router DOM for routing
- Context API for global state (AuthContext and SearchContext)
- Axios for HTTP requests
- TailwindCSS and custom CSS for styling
- React Toastify for notifications

### Backend

- Node.js and Express.js
- MySQL database hosted on Railway
- JSON Web Tokens (JWT) for authentication
- Multer for file uploads
- CORS and dotenv for configuration

## Project Structure

```
├── backend/
│   ├── routes/           # Express route definitions
│   ├── controllers/      # Logic for handling requests
│   ├── middleware/       # Authentication and admin checks
│   ├── db.js             # Database connection
│   └── server.js         # Entry point for backend
├── frontend/
│   ├── components/       # Reusable React components
│   ├── context/          # Auth and search context providers
│   ├── App.jsx           # App entry and routes
│   └── index.css         # Global styling
├── docker-compose.yml    # Docker config for backend and frontend
```

## Running Locally with Docker

### Prerequisites

- Docker and Docker Compose installed

### Steps

```bash
# Clone the repository
git clone https://github.com/Nevilllf/forum-app.git
cd forum-app

# Build and run containers
docker-compose up --build
```

- The frontend will run on `http://localhost:3000`
- The backend API will be accessible at `http://localhost:5001`

Note: The application uses a Railway-hosted MySQL database and does not require a local database container.

## Admin Access

- Admin accounts are marked in the database with `isAdmin = true`
- Admin-only endpoints are protected via middleware
- Admin tools are available via the navigation bar once logged in as admin

## Key Pages and Views

- Channel List
- Channel Thread View (posts within a channel)
- Post Detail View (with nested replies)
- Profile Page (update name, bio, and avatar)
- Admin User List (view and delete users)
- User Explorer (search and sort public stats)

## API Overview

- RESTful endpoints structured under `/api`
- Protected routes use JWT token verification
- Multer handles file uploads to the `/uploads` directory
- Static files (avatars, screenshots) are publicly accessible via `/uploads/*`

## Packages Used

### Backend

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.2",
    "mysql2": "^3.14.0"
  }
}
```

### Frontend

```json
{
  "dependencies": {
    "axios": "^1.8.4",
    "jwt-decode": "^4.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.4.0",
    "react-toastify": "^11.0.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.0",
    "vite": "^6.2.0"
  }
}
```

## Deployment and Hosting

- Frontend is built using Vite and served via Nginx in production
- Backend runs on Node.js with Express on port 5001
- Ready for deployment on Railway, Vercel, or similar platforms

## Environment Configuration

`.env` (Backend)

```env
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=your-db-port
JWT_SECRET=your-secret-key
PORT=5001
```

## Docker and Production

- **Frontend Dockerfile**: builds and serves React app via Nginx
- **Backend Dockerfile**: starts Node.js server
- **Docker Compose**: spins up both services

To build and run:

```bash
docker-compose up --build
```

## License

This project is licensed under the MIT License.

## Author

Developed by [Nevil Findoriya]  
GitHub: [https://github.com/Nevilllf](https://github.com/Nevilllf)

