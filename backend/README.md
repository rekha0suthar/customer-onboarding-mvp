# Customer Onboarding MVP - Backend API

RESTful API for customer onboarding with authentication, profile management, and document verification.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user

### Customer Profile
- `GET /api/customers/profile` - Get profile
- `PUT /api/customers/profile` - Update profile
- `GET /api/customers/status` - Get onboarding status
- `PUT /api/customers/status` - Update onboarding step
- `GET /api/customers/activities` - Get activity log

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get specific document
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

## Tech Stack

- Node.js + Express
- PostgreSQL
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

## Database

PostgreSQL with 4 tables:
- `users` - Authentication
- `customers` - Profile information
- `documents` - Uploaded documents
- `onboarding_activities` - Activity log

