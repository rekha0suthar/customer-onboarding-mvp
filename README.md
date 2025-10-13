# Customer Onboarding MVP - Backend API

A comprehensive backend API for customer onboarding with authentication, profile management, and document verification.

## Features

- User Authentication (Register/Login with JWT)
- Customer Profile Management
- Document Upload & Verification
- Onboarding Status Tracking
- RESTful API Architecture

## Tech Stack

- **Node.js** with Express.js
- **PostgreSQL** for database
- **JWT** for authentication
- **Multer** for file uploads

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v13+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database credentials

5. Create database:
   ```sql
   CREATE DATABASE customer_onboarding;
   ```

6. Run migrations:
   ```bash
   npm run migrate
   ```

7. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Customer Profile
- `GET /api/customers/profile` - Get customer profile
- `PUT /api/customers/profile` - Update customer profile
- `GET /api/customers/status` - Get onboarding status

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get all documents
- `DELETE /api/documents/:id` - Delete document

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── database/       # Database setup and migrations
├── middleware/     # Custom middleware
├── models/         # Data models
├── routes/         # API routes
├── utils/          # Utility functions
└── server.js       # Entry point
```

## License

ISC

