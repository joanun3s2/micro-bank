# Auth Service

A simple authentication service built with Express.js and Firebase Auth that provides user registration, login, and token validation for microservices.

## Features

- User registration with email/password
- User login with custom token generation
- Token validation for microservices
- Firebase Admin SDK integration
- TypeScript support
- CORS enabled
- Health check endpoint

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Firebase project with Authentication enabled
- Firebase Admin SDK service account key

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy the environment example file:

```bash
cp env.example .env
```

3. Configure Firebase:

   - Go to your Firebase Console
   - Navigate to Project Settings > Service Accounts
   - Generate a new private key
   - Download the JSON file
   - Copy the values to your `.env` file

4. Build the project:

```bash
npm run build
```

## Development

Start the development server:

```bash
npm run dev
```

The service will run on `http://localhost:3003`

## API Endpoints

### Health Check

```
GET /health
```

### Signup

```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Validate Token

```
POST /auth/validate
Content-Type: application/json

{
  "token": "firebase-id-token"
}
```

## Response Format

All endpoints return a consistent response format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "uid": "user-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "token": "custom-token"
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Integration with Other Services

### Using the Auth Middleware

Other services can use the auth middleware to validate tokens:

```typescript
import {
  validateToken,
  AuthenticatedRequest,
} from "service-auth/src/middleware/authMiddleware";

app.use("/protected", validateToken);

app.get("/protected/data", (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});
```

### Making Requests to Auth Service

```typescript
// Validate a token
const response = await fetch("http://localhost:3003/auth/validate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ token: "firebase-id-token" }),
});

const result = await response.json();
```

## Environment Variables

| Variable                               | Description                     | Required           |
| -------------------------------------- | ------------------------------- | ------------------ |
| `PORT`                                 | Server port                     | No (default: 3003) |
| `FIREBASE_TYPE`                        | Firebase service account type   | Yes                |
| `FIREBASE_PROJECT_ID`                  | Firebase project ID             | Yes                |
| `FIREBASE_PRIVATE_KEY_ID`              | Firebase private key ID         | Yes                |
| `FIREBASE_PRIVATE_KEY`                 | Firebase private key            | Yes                |
| `FIREBASE_CLIENT_EMAIL`                | Firebase client email           | Yes                |
| `FIREBASE_CLIENT_ID`                   | Firebase client ID              | Yes                |
| `FIREBASE_AUTH_URI`                    | Firebase auth URI               | Yes                |
| `FIREBASE_TOKEN_URI`                   | Firebase token URI              | Yes                |
| `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` | Firebase auth provider cert URL | Yes                |
| `FIREBASE_CLIENT_X509_CERT_URL`        | Firebase client cert URL        | Yes                |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

## Security Notes

- Always use HTTPS in production
- Store Firebase credentials securely
- Implement rate limiting for production use
- Consider adding request validation middleware
- Use environment variables for all sensitive configuration
