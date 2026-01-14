## 🔧 GigFlow Backend API

🎯 About
The GigFlow Backend API is a robust Node.js/Express server that powers the GigFlow freelance marketplace. It handles user authentication, gig management, bidding workflows, and real-time notifications using Socket.IO.
Key Highlights

🔐 JWT Authentication with HttpOnly cookies
💾 MongoDB with Mongoose ODM
⚡ Real-time notifications via Socket.IO
🔒 Transaction-safe hiring with MongoDB sessions
🛡️ Secure middleware for route protection
📡 RESTful API design with proper status codes

✨ Features
Core Features

✅ User registration and login with JWT
✅ Password hashing with bcrypt
✅ HttpOnly cookie-based auth
✅ Protected routes with auth middleware
✅ CRUD operations for gigs
✅ Search and filter gigs
✅ Bid submission and management
✅ Smart hiring logic with atomic updates

Bonus Features

✅ MongoDB Transactions for race condition prevention
✅ Socket.IO Integration for real-time hire notifications
✅ User connection tracking for online/offline status
✅ Error handling middleware
✅ CORS configuration for cross-origin requests
POST /api/auth/register 
# Clone the repository

```
git clone https://github.com/Dev-ayansharma/gigbflowback.git
cd gigbflowback
```
# Install dependencies
```
npm install

```
# install packages
 ```
npm i nodemon cors jsonwebtoken bcrypt cookie-parser express http mongoose dotenv socket.io
```
have configuration like in package.json

# Set up environment variables
```
MONGODB_URI=
PORT=
TOKEN_SECRET_EXPIRES_IN=
JWT_SECRET=
ORIGIN=
```

# Run in development mode
npm run dev

# Run in production mode
npm start

## Api structure to test
Base URL : http://localhost:9000/app
Register User :POST /auth/register
Login User :POST /auth/login
Get user : GET /auth/me
Logout user : POST /auth/logout
GetallgigsGET /gigs/allgigs/?title=""
getallgigsbytitle GET /gigs/allgigs/?title="title"
uploadgig  POST /gigs
createbid POST /bids/:gigId
fecthallbids GET /bids/:gigId
hireabid PATCH /bids/:bidId/hire
