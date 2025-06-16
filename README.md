# MeetMe - Video Conferencing Platform

MeetMe is a modern, scalable video conferencing platform built with Node.js, TypeScript, and Express. It provides real-time video communication capabilities similar to Google Meet, with additional features for user management, meeting scheduling, and collaboration.

## 🌟 Key Features

### Core Features

- Real-time video conferencing
- User authentication and authorization
- Meeting scheduling and management
- Screen sharing capabilities
- Chat functionality during meetings
- Meeting recording (optional)
- Participant management
- Meeting room customization

### Technical Features

- TypeScript-based Node.js application
- Express.js web framework
- MongoDB database with Mongoose ODM
- Redis for caching and real-time features
- JWT authentication
- Email notifications with Nodemailer
- Docker support for easy deployment
- Jest testing framework
- Environment-based configuration
- WebSocket integration for real-time communication
- RESTful API architecture
- Clean Architecture principles
- Dependency Injection with TSyringe

## 🏗️ Architecture

### Project Structure

```
src/
├── application/          # Application business logic
│   ├── services/        # Business services
│   └── use-cases/       # Use case implementations
├── domain/              # Domain models and interfaces
│   ├── entities/        # Domain entities
│   ├── repositories/    # Repository interfaces
│   └── value-objects/   # Value objects
├── infrastructure/      # External services and implementations
│   ├── api/            # Express routes and controllers
│   │   ├── controllers/ # Request handlers
│   │   ├── middlewares/ # Custom middlewares
│   │   └── routes/     # API routes
│   ├── database/       # Database configurations
│   │   ├── models/     # Mongoose models
│   │   └── repositories/ # Repository implementations
│   └── services/       # External service integrations
│       ├── email/      # Email service
│       ├── redis/      # Redis service
│       └── websocket/  # WebSocket service
└── shared/             # Shared utilities and helpers
    ├── config/         # Configuration files
    ├── errors/         # Custom error classes
    ├── types/          # TypeScript types
    └── utils/          # Utility functions
```

### Technology Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT
- **Email**: Nodemailer
- **Testing**: Jest
- **Containerization**: Docker
- **Dependency Injection**: TSyringe
- **Validation**: Zod
- **Logging**: Morgan
- **Real-time**: WebSocket

## 📋 Prerequisites

### System Requirements

- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB (if running locally)
- Redis (if running locally)
- Git

### Development Tools

- VS Code (recommended)
- Postman or similar API testing tool
- MongoDB Compass (optional)
- Redis Commander (optional)

## 🛠️ Installation

1. **Clone the Repository**

```bash
git clone <repository-url>
cd meetme
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development
API_PREFIX=/api/v1

# MongoDB Configuration
MONGO_URI=mongodb://mongo:27017/meetme
MONGO_USER=your_username
MONGO_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_FROM=MeetMe <noreply@meetme.com>

# WebSocket Configuration
WS_PORT=4001
WS_PATH=/ws

# Meeting Configuration
MAX_PARTICIPANTS=50
MEETING_DURATION_LIMIT=1440 # minutes
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Using Docker**

```bash
docker-compose -f docker-compose.dev.yml -f docker-compose.yml up --build
```

2. **Without Docker**

```bash
npm run dev
```

### Production Mode

1. **Using Docker**

```bash
docker-compose -f docker-compose.prod.yml -f docker-compose.yml up --build
```

2. **Without Docker**

```bash
npm run build
npm start
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test/file.test.ts
```


```

## 📦 Docker Configuration

### Services

- **Web**: Node.js application
- **Mongo**: MongoDB database
- **Mongo Express**: Web-based MongoDB admin interface
- **Redis**: Redis cache server

### Docker Compose Files

- `docker-compose.yml`: Base configuration
- `docker-compose.dev.yml`: Development environment
- `docker-compose.prod.yml`: Production environment

##  Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation with Zod
- Secure HTTP headers
- Environment variable protection
- XSS protection
- CSRF protection

## 📈 Performance Optimizations

- Redis caching
- Database indexing
- Connection pooling
- Request compression
- Response caching
- Efficient error handling
- TypeScript for better code quality
- Lazy loading where applicable

## 🔍 API Documentation

### Authentication Endpoints

- POST `/api/v1/auth/register` - User registration
- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/refresh` - Refresh token
- POST `/api/v1/auth/logout` - User logout

### Meeting Endpoints

- POST `/api/v1/meetings` - Create meeting
- GET `/api/v1/meetings` - List meetings
- GET `/api/v1/meetings/:id` - Get meeting details
- PUT `/api/v1/meetings/:id` - Update meeting
- DELETE `/api/v1/meetings/:id` - Delete meeting

### User Endpoints

- GET `/api/v1/users/profile` - Get user profile
- PUT `/api/v1/users/profile` - Update user profile
- GET `/api/v1/users/meetings` - Get user's meetings

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation
- Follow the existing code style
- Use meaningful commit messages

##  Known Issues

- List any known issues here
- Include workarounds if available

##  Changelog

### Version 1.0.0

- Initial release
- Basic video conferencing features
- User authentication
- Meeting management

##  Support

For support, please:

- Open an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- List any third-party libraries or tools used
- Credit any inspiration or resources
- Thank contributors
