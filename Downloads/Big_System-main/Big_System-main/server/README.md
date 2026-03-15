# TutorHub Institute - Backend API

A comprehensive Node.js/Express backend for the TutorHub Institute tutoring platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Student and Tutor registration, login, profile management
- **Course Management**: Create, update, delete, and browse courses
- **Booking System**: Schedule and manage tutoring sessions
- **Payment Integration**: CBE and Telebirr payment gateway support (ETB)
- **Resource Management**: Free and premium study materials, AASTU papers
- **Review System**: Rate and review tutors after sessions
- **Security**: Helmet.js, rate limiting, input validation

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation
- Helmet.js for security headers
- express-rate-limit for API rate limiting

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
copy .env.example .env
```

3. Update `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tutorhub
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB (make sure MongoDB is installed and running)

5. Start the server:

```bash
# Development mode with nodemon
npm run dev

```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication

#### Students

- `POST /api/students/register` - Register new student
- `POST /api/students/login` - Student login
- `GET /api/students/profile` - Get student profile (Protected)
- `PUT /api/students/profile` - Update student profile (Protected)

#### Tutors

- `POST /api/tutors/register` - Register new tutor
- `POST /api/tutors/login` - Tutor login
- `GET /api/tutors/profile` - Get tutor profile (Protected)
- `PUT /api/tutors/profile` - Update tutor profile (Protected)
- `GET /api/tutors` - Get all verified tutors
- `GET /api/tutors/:id` - Get single tutor

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Tutor only)
- `PUT /api/courses/:id` - Update course (Tutor owner only)
- `DELETE /api/courses/:id` - Delete course (Tutor owner only)
- `POST /api/courses/:id/enroll` - Enroll in course (Student only)

### Bookings

- `POST /api/bookings` - Create booking (Student only)
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/payment` - Update payment status
- `PUT /api/bookings/:id/complete` - Mark as completed (Tutor only)
- `DELETE /api/bookings/:id` - Cancel booking

### Resources

- `GET /api/resources` - Get all resources
- `GET /api/resources/free` - Get free resources
- `GET /api/resources/premium` - Get premium resources (Premium users)
- `GET /api/resources/aastu` - Get AASTU papers (Premium users)
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources/:id/download` - Download resource
- `POST /api/resources` - Create resource (Protected)

### Reviews

- `POST /api/reviews` - Create review (Student only)
- `GET /api/reviews/tutor/:tutorId` - Get tutor reviews
- `GET /api/reviews/course/:courseId` - Get course reviews
- `GET /api/reviews/my-reviews` - Get student's reviews (Student only)

### Payments

- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment (Webhook)
- `POST /api/payments/subscription` - Subscribe to premium
- `POST /api/payments/subscription/verify` - Verify subscription (Webhook)

### Health Check

- `GET /api/health` - API health check

## Authentication

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Request Examples

### Register Student

```bash
POST /api/students/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "studentId": "ETS1234/22",
  "gradeLevel": "12",
  "phone": "+251912345678"
}
```

### Login

```bash
POST /api/students/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Course (Tutor)

```bash
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced Mathematics",
  "description": "Comprehensive math course for Grade 12",
  "subject": "mathematics",
  "gradeLevel": "12",
  "price": 1500,
  "duration": 2,
  "maxStudents": 20,
  "schedule": "Mon, Wed, Fri 3-5 PM"
}
```

## Database Models

- **Student**: Student user accounts
- **Tutor**: Tutor user accounts
- **Course**: Course listings
- **Booking**: Session bookings
- **Resource**: Study materials and past papers
- **Review**: Student reviews for tutors

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Role-based access control

## Error Handling

All errors return JSON with appropriate HTTP status codes:

```json
{
  "error": "Error message here"
}
```

## Future Enhancements

- [ ] Actual CBE/Telebirr API integration
- [ ] SendGrid email notifications
- [ ] AWS S3 file upload for resources
- [ ] WebRTC/Jitsi integration for live sessions
- [ ] Admin dashboard endpoints
- [ ] Socket.io for real-time notifications
- [ ] Cron jobs for subscription expiry checks

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
