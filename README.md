# Social Media App Project

A modern social media application built with Node.js and MongoDB featuring advanced capabilities like posts, groups, location sharing, real-time notifications, and Twitter (X) integration.

## Key Features

- **User Management** - Registration, authentication, and personal profiles
- **Posts System** - Create, edit, and delete posts with media support
- **Groups** - Create groups and share posts within them
- **Following System** - Follow other users and see their activity
- **Location Sharing** - Share location on interactive maps (Google Maps integration)
- **Statistics** - Reports and analytics on user activity
- **Search** - Advanced search for users, posts, and groups
- **Twitter (X) Integration** - Connect with Twitter/X to post in this app and on your twitter account at the same time

## System Requirements

- **Node.js**
- **MongoDB**

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/OfekSagiv/social-media-app-project
cd social-media-app-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-app

PORT=8080

GOOGLE_API_KEY=your-google-maps-api-key

# Twitter (X) Integration
X_CLIENT_ID=your-twitter-client-id
X_CLIENT_SECRET=your-twitter-client-secret
X_REDIRECT_URI=http://localhost:8080/auth/x/callback
X_SCOPES=tweet.read,tweet.write,users.read,offline.access
```

### 4. Run the Application

**Development mode:**
```bash
npm run dev
```

The application will be available at: `http://localhost:3001`

## Project Structure

```
social-media-app-project/
├── src/
│   ├── app.js                 # Main application configuration
│   ├── index.js              # Server entry point
│   ├── db.js                 # Database connection
│   ├── controllers/          # HTTP request handlers
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── group.controller.js
│   │   ├── user.controller.js
│   │   └── ...
│   ├── models/               # MongoDB models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Group.js
│   │   └── Notification.js
│   ├── repositories/         # Data access layer
│   │   ├── user.repository.js
│   │   ├── post.repository.js
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── auth.service.js
│   │   ├── post.service.js
│   │   └── ...
│   ├── routes/              # API and page routes
│   │   ├── api.routes.js
│   │   ├── view.routes.js
│   │   └── ...
│   ├── middleware/          # Custom middleware functions
│   │   ├── auth.js
│   │   └── upload.js
│   ├── views/               # EJS templates
│   │   ├── home.ejs
│   │   ├── profile.ejs
│   │   └── partials/
│   ├── public/              # Static files
│   │   ├── js/             # Client-side JavaScript
│   │   ├── styles/         # CSS files
│   │   └── img/            # Images
│   └── utils/               # Helper functions
├── uploads/                 # User uploaded files
├── package.json
└── README.md
```

## Technologies

### Backend
- **Express.js** - framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ORM
- **EJS** - Template engine

### Frontend
- **HTML5 & CSS3** - Structure and styling
- **JavaScript (ES6+)** - Interactivity
- **Bootstrap Icons** - Icon library
- **Google Maps API** - Interactive maps

## More Features

### Authorization System
- Session-based user authentication
- Dynamic permissions by role (user/group admin)
- Protected route middleware

### File Upload System
- Support for images and videos
- File type and size validation
- Secure server-side storage

### Search System
- User search by username or full name
- Post content search
- Group search by name and description

### Maps & Location
- Google Maps integration
- User location storage
- Map display of users
- City-based filtering

### Twitter (X) Integration
- OAuth 2.0 secure authentication
- Dedicated connection interface
- post to both platforms simultaneously

### User Interface

- Modern design with glass morphism effects
- Smooth animations
- Advanced Toast notification system
