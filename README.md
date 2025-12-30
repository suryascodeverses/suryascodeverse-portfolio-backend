# Portfolio Backend API

Node.js + Express backend for Portfolio Management System.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 4. Create Admin User (First Time Only)
```bash
# Start the server
npm run dev

# In another terminal, create admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "yourpassword"
  }'
```

### 5. Test the API
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "yourpassword"
  }'
```

## 📁 Project Structure

```
portfolio-backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── projectController.js # Projects CRUD
│   ├── skillController.js   # Skills CRUD
│   └── blogController.js    # Blog CRUD
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── errorHandler.js     # Global error handler
│   └── upload.js           # File upload (Multer)
├── models/
│   ├── User.js             # User schema
│   ├── Project.js          # Project schema
│   ├── Skill.js            # Skill schema
│   └── BlogPost.js         # Blog schema
├── routes/
│   ├── auth.js             # Auth routes
│   ├── projects.js         # Project routes
│   ├── skills.js           # Skill routes
│   └── blog.js             # Blog routes
├── uploads/                # Uploaded files
├── .env.example            # Environment template
├── .gitignore
├── package.json
├── server.js               # Entry point
└── README.md
```

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register first admin |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |
| POST | `/api/auth/logout` | Private | Logout user |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | Public | Get all projects |
| GET | `/api/projects/:id` | Public | Get single project |
| POST | `/api/projects` | Private | Create project |
| PUT | `/api/projects/:id` | Private | Update project |
| DELETE | `/api/projects/:id` | Private | Delete project |

### Skills
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/skills` | Public | Get all skills |
| GET | `/api/skills/:id` | Public | Get single skill |
| POST | `/api/skills` | Private | Create skill |
| PUT | `/api/skills/:id` | Private | Update skill |
| DELETE | `/api/skills/:id` | Private | Delete skill |

### Blog
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/blog` | Public | Get all posts (published only) |
| GET | `/api/blog/:slug` | Public | Get single post |
| GET | `/api/blog/tag/:tag` | Public | Get posts by tag |
| POST | `/api/blog` | Private | Create post |
| PUT | `/api/blog/:slug` | Private | Update post |
| DELETE | `/api/blog/:slug` | Private | Delete post |

## 🔑 Authentication

Protected routes require JWT token in Authorization header:
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Project",
    "description": "Project description",
    "image": "https://example.com/image.jpg",
    "technologies": ["React", "Node.js"],
    "featured": true
  }'
```

## 🗄️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/portfolio |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `MAX_FILE_SIZE` | Max upload size in bytes | 5242880 (5MB) |
| `UPLOAD_PATH` | Upload directory | ./uploads |

## 🧪 Scripts

```bash
# Start server (production)
npm start

# Start server with nodemon (development)
npm run dev
```

## 🚨 Error Handling

All errors return JSON:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **multer** - File upload
- **morgan** - HTTP request logger

## 🔒 Security Features

- JWT authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- MongoDB injection prevention
- XSS protection (via helmet - recommended to add)
- Rate limiting (recommended to add)

## 📝 Notes

- Registration endpoint is disabled after first admin user creation
- JWT tokens expire in 7 days by default
- File uploads limited to 5MB
- Only image files allowed for uploads
- Mongoose validation on all models

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### CORS Issues
```bash
# Update FRONTEND_URL in .env
FRONTEND_URL=http://localhost:3000
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)


{
  "email": "wiyesoy114@dfesc.com",
  "password" : "123456",
  "name": "surya"
}