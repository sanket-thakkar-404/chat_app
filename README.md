# 💬 Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring instant messaging, friend management, and user authentication.

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- Email verification with OTP
- Password reset functionality
- JWT-based authentication
- Secure password hashing with bcrypt
- Cookie-based session management

### 💬 Real-Time Messaging
- Real-time chat using Socket.io
- Instant message delivery
- Typing indicators
- Online/offline status
- Message history
- Starred messages

### 👥 Social Features
- Friend request system
- Add/remove friends
- Friend recommendations
- User search functionality
- User profiles with avatars
- Notifications

### 🎨 User Interface
- Modern and responsive design
- Dark/Light theme support
- TailwindCSS styling
- DaisyUI components
- Smooth animations with GSAP
- Emoji picker
- Loading states and skeletons

### 📱 Additional Features
- Profile management
- Settings page
- Group chat support
- Image upload with Cloudinary
- Email notifications

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer/Resend** - Email services
- **Express Validator** - Input validation

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time client
- **TailwindCSS** - Styling
- **DaisyUI** - Component library
- **GSAP** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Emoji Picker React** - Emoji support

## 📁 Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.config.js
│   │   │   ├── db.js
│   │   │   └── email.config.js
│   │   ├── Controller/
│   │   │   ├── auth.controller.js
│   │   │   ├── message.controller.js
│   │   │   └── user.controller.js
│   │   ├── lib/
│   │   │   ├── Socket.js
│   │   │   └── utils.js
│   │   ├── Middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── auth.validate.js
│   │   │   ├── SendEmail.js
│   │   │   ├── verifyCodeTemplate.js
│   │   │   └── WelcomeEmail.js
│   │   ├── Models/
│   │   │   ├── friendRequest.model.js
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── Routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── message.routes.js
│   │   │   └── user.routes.js
│   │   ├── seeds/
│   │   │   └── user.seed.js
│   │   ├── validators/
│   │   │   └── auth.validator.js
│   │   └── server.js
│   ├── package.json
│   └── Readme.md
│
├── client/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Chat/
│   │   │   ├── Friends/
│   │   │   ├── Reuseable/
│   │   │   └── skeletons/
│   │   ├── Constants/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── Store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@yourdomain.com
   ```

4. **Run the application**

   **Development Mode:**
   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm run dev

   # Terminal 2 - Start frontend
   cd client
   npm run dev
   ```

   **Production Mode:**
   ```bash
   # Build the application
   npm run build

   # Start the server
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend verification OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `GET /api/users/friends` - Get user's friends
- `POST /api/users/friend-request` - Send friend request
- `PUT /api/users/friend-request/:id` - Accept/Reject friend request
- `DELETE /api/users/friend/:id` - Remove friend

### Messages
- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/messages` - Send a message
- `PUT /api/messages/:id/star` - Star/Unstar a message
- `DELETE /api/messages/:id` - Delete a message

## 🎯 Key Features Explained

### Real-Time Communication
The application uses Socket.io for real-time bidirectional communication. When a user sends a message, it's instantly delivered to the recipient without page refresh.

### Friend Management
Users can search for other users, send friend requests, and manage their friend list. The system includes notifications for friend requests.

### Authentication Flow
1. User registers with email and password
2. OTP is sent to email for verification
3. After verification, user can login
4. JWT tokens are stored in HTTP-only cookies for security

### Message Features
- Real-time message delivery
- Typing indicators
- Online/offline status
- Message starring
- Message history

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Theme Support**: Dark and light themes
- **Loading States**: Skeleton loaders for better UX
- **Toast Notifications**: User-friendly notifications
- **Smooth Animations**: GSAP animations for enhanced experience

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)

## 🚢 Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas is configured
3. Deploy the backend folder

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build --prefix client`
2. Deploy the `client/dist` folder or connect your repository
3. Set environment variables for API endpoints

### Full Stack Deployment
The application supports serving the frontend from the backend in production mode. Simply set `NODE_ENV=production` and the backend will serve the built React app.

## 📝 Scripts

### Root Level (`package.json`)
The root `package.json` provides convenient scripts to manage the entire monorepo:

```json
{
  "name": "chat-app",
  "version": "1.0.0",
  "scripts": {
    "build": "npm install --prefix backend && npm install --prefix client && npm run build --prefix client",
    "start": "npm run start --prefix backend"
  }
}
```

**Available Commands:**
- `npm run build` - Install all dependencies (backend + client) and build the React client for production
- `npm start` - Start the backend server in production mode

**Usage:**
```bash
# Build the entire application
npm run build

# Start the production server
npm start
```

### Backend (`backend/package.json`)
- `npm run dev` - Start development server with nodemon (auto-restart on changes)
- `npm start` - Start production server

**Usage:**
```bash
cd backend
npm run dev  # Development mode
npm start    # Production mode
```

### Frontend (`client/package.json`)
- `npm run dev` - Start Vite development server (usually on http://localhost:5173)
- `npm run build` - Build for production (outputs to `dist/` folder)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

**Usage:**
```bash
cd client
npm run dev     # Development mode
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Check code quality
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC License

## 👤 Author

**Sanket Thakkar**

## 🙏 Acknowledgments

- Socket.io for real-time communication
- React team for the amazing framework
- TailwindCSS for styling utilities
- All open-source contributors

---

Made with ❤️ using MERN Stack

