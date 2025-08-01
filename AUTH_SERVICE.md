# Auth Service - Micro-Bank Authentication

A simple authentication service built with Express.js and Firebase Auth that provides user registration, login, and token validation for the micro-bank project.

## 🚀 Features

- **User Registration**: Sign up with email/password
- **User Login**: Authenticate and receive custom tokens
- **Token Validation**: Verify tokens for microservices
- **Firebase Integration**: Uses Firebase Admin SDK
- **TypeScript Support**: Full type safety
- **Docker Ready**: Containerized deployment
- **Health Checks**: Service monitoring endpoint

## 📁 Project Structure

```
service-auth/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase Admin SDK configuration
│   ├── controllers/
│   │   └── authController.ts     # Auth endpoints logic
│   ├── middleware/
│   │   └── authMiddleware.ts     # Token validation middleware
│   ├── routes/
│   │   └── authRoutes.ts        # API route definitions
│   ├── types/
│   │   └── auth.ts              # TypeScript type definitions
│   ├── __tests__/
│   │   └── authController.test.ts # Unit tests
│   └── index.ts                 # Main application file
├── Dockerfile                   # Container configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Test configuration
├── env.example                 # Environment variables template
└── README.md                   # Service documentation
```

## 🔧 Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- Firebase project with Authentication enabled
- Firebase Admin SDK service account key

### 2. Installation

```bash
cd service-auth
npm install
cp env.example .env
```

### 3. Firebase Configuration

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key
3. Download the JSON file
4. Copy the values to your `.env` file

### 4. Environment Variables

```env
PORT=3003
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=Your private key here
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-your-project-id.
```

## 🚀 Running the Service

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t service-auth .
docker run -p 3003:3003 service-auth
```

## 📡 API Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Auth service is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### User Signup

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "uid": "user-id",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

### User Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "uid": "user-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "token": "custom-token"
  }
}
```

### Token Validation

```http
POST /auth/validate
Content-Type: application/json

{
  "token": "firebase-id-token"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "uid": "user-id",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

## 🔗 Integration with Other Services

### Using Auth Middleware

Other services can use the auth middleware to validate tokens:

```typescript
import {
  validateToken,
  AuthenticatedRequest,
} from "service-auth/src/middleware/authMiddleware";

app.use("/protected", validateToken);

app.get("/protected/data", (req: AuthenticatedRequest, res: Response) => {
  // req.user contains the authenticated user information
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

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### API Tests

```bash
node test-api.js
```

### Coverage

```bash
npm run test:cov
```

## 🐳 Docker Integration

The auth service is integrated into the main docker-compose.yml:

```yaml
auth-service:
  build:
    context: service-auth
    dockerfile: Dockerfile
  ports:
    - "${AUTH_PORT}:${AUTH_PORT}"
  environment:
    - PORT=${AUTH_PORT}
  env_file:
    - .env
  volumes:
    - ./service-auth:/app
    - /app/node_modules
  command: npm run dev
  restart: "always"
```

## 🔒 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Store Firebase credentials securely
3. **Rate Limiting**: Implement rate limiting for production
4. **Token Expiration**: Set appropriate token expiration times
5. **Input Validation**: Validate all input data
6. **Error Handling**: Don't expose sensitive information in errors

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Service logs available in Docker containers
- Firebase Admin SDK provides built-in monitoring

## 🚀 Deployment

### Local Development

```bash
cd service-auth
npm run dev
```

### Docker Compose

```bash
docker-compose up auth-service
```

### Production

```bash
npm run build
npm start
```

## 📝 Notes

- The service runs on port 3003 by default
- Firebase Admin SDK is used for server-side authentication
- Custom tokens are generated for client authentication
- All responses follow a consistent JSON format
- CORS is enabled for cross-origin requests
- TypeScript provides full type safety

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Configuration**: Ensure all environment variables are set correctly
2. **Port Conflicts**: Check if port 3003 is available
3. **Docker Issues**: Ensure Docker is running and ports are exposed
4. **Token Validation**: Verify Firebase project settings and service account permissions

### Debug Mode

```bash
DEBUG=* npm run dev
```

The auth service is now ready to provide authentication for the micro-bank project! 🎉
