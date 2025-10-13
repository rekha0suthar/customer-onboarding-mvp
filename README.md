# Customer Onboarding MVP

A full-stack customer onboarding application with backend API and future frontend integration.

## Project Structure

```
customer-onboarding-mvp/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
└── README.md
```

## Backend API

RESTful API for customer onboarding with:
- User Authentication (JWT)
- Customer Profile Management
- Document Upload & Verification
- Onboarding Status Tracking

### Tech Stack
- **Node.js** + Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

See [backend/README.md](backend/README.md) for detailed documentation.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user

### Customer Profile
- `GET /api/customers/profile` - Get customer profile
- `PUT /api/customers/profile` - Update customer profile
- `GET /api/customers/status` - Get onboarding status
- `PUT /api/customers/status` - Update onboarding step
- `GET /api/customers/activities` - Get activity log

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get specific document
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

## Database Schema

- **users** - Authentication (email, password, role)
- **customers** - Profile information (name, address, onboarding status)
- **documents** - Uploaded files with verification status
- **onboarding_activities** - Activity audit log

## Features

✅ User registration and authentication
✅ JWT token-based security
✅ Customer profile management
✅ Document upload (PDF, JPG, PNG, DOC)
✅ Onboarding step tracking
✅ Activity logging
✅ RESTful API design

## License

ISC
