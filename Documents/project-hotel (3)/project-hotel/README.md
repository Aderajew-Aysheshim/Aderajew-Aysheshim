# Lucy Luxury Resort - Setup Instructions

## Project Overview
This is a full-stack hotel management system with:
- **Frontend**: React.js with Bootstrap
- **Backend**: Node.js/Express
- **Database**: MySQL

## Prerequisites
1. Node.js installed
2. MySQL installed and running
3. MySQL credentials: root / 1234567 (or update in .env)

## Setup Steps

### 1. Database Setup
1. Open MySQL (phpMyAdmin or command line)
2. Create the database and tables:
   ```
   Open MySQL and run the commands in: server/database.sql
   ```
   Or use command line:
   ```bash
   mysql -u root -p < server/database.sql
   ```

### 2. Backend Setup
```bash
cd project-hotel/server
npm install
npm start
```
- Server runs on http://localhost:5000
- Test: http://localhost:5000/api/health

### 3. Frontend Setup
```bash
cd project-hotel/client
npm install
npm start
```
- Client runs on http://localhost:3000

## Default Admin Credentials
- Email: admin@lucyluxury.com
- Password: admin123

## Features
- User registration and login
- Room booking
- Restaurant ordering
- Transport booking
- Gym session booking
- Admin dashboard for managing all bookings

## API Endpoints
- `/api/health` - Health check
- `/api/register` - User registration
- `/api/login` - User login
- `/api/rooms` - Get available rooms
- `/api/book-room` - Book a room
- `/api/menu` - Get restaurant menu
- `/api/order-food` - Place food order
- `/api/book-transport` - Book transport
- `/api/gym-schedule` - Get gym schedule
- `/api/book-gym` - Book gym session
- `/api/admin/*` - Admin endpoints (require JWT + admin role)