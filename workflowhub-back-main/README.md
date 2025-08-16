# Workflow Backend API

A comprehensive workflow management backend API built with Node.js, Express, and MongoDB. This API provides project and task management capabilities with real-time progress tracking and team collaboration features.

## 🚀 Features

- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Full CRUD operations for tasks with status tracking
- **Progress Tracking**: Automatic progress calculation based on task completion
- **Team Management**: Assign team members to projects and tasks
- **Validation**: Comprehensive input validation using Joi
- **Error Handling**: Consistent error responses and logging
- **MongoDB Integration**: Robust database operations with Mongoose
- **RESTful API**: Clean and intuitive API endpoints

## 📁 Project Structure

```
workflow-back/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── projectController.js # Project business logic
│   └── taskController.js    # Task business logic
├── middleware/
│   └── validation.js        # Request validation middleware
├── models/
│   ├── Project.js           # Project data model
│   └── Task.js              # Task data model
├── routes/
│   ├── projectRoutes.js     # Project API routes
│   └── taskRoutes.js        # Task API routes
├── utils/
│   └── responseHandler.js   # Response utility functions
├── server.js                # Main application entry point
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd workflow-back
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**

   - Local MongoDB: Ensure MongoDB is running on your system
   - MongoDB Atlas: Use your cloud connection string

5. **Run the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Projects

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/projects`              | Get all projects        |
| GET    | `/api/projects/:id`          | Get project by ID       |
| POST   | `/api/projects`              | Create new project      |
| PUT    | `/api/projects/:id`          | Update project          |
| DELETE | `/api/projects/:id`          | Delete project          |
| GET    | `/api/projects/:id/tasks`    | Get project tasks       |
| GET    | `/api/projects/:id/stats`    | Get project statistics  |
| PATCH  | `/api/projects/:id/progress` | Update project progress |

### Tasks

| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| GET    | `/api/tasks`                    | Get all tasks        |
| GET    | `/api/tasks/:id`                | Get task by ID       |
| POST   | `/api/tasks`                    | Create new task      |
| PUT    | `/api/tasks/:id`                | Update task          |
| DELETE | `/api/tasks/:id`                | Delete task          |
| GET    | `/api/tasks/project/:projectId` | Get tasks by project |
| PATCH  | `/api/tasks/:id/status`         | Update task status   |
| GET    | `/api/tasks/stats`              | Get task statistics  |

### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

## 📊 Data Models

### Project Schema

- `title` (required): Project name
- `description`: Project description
- `status`: planning, active, completed, on-hold
- `progress`: 0-100 percentage
- `team`: Array of team members
- `dueDate`: Project deadline
- `createdAt`, `updatedAt`: Timestamps

### Task Schema

- `title` (required): Task name
- `description`: Task description
- `status`: todo, in-progress, done
- `priority`: low, medium, high
- `assignee` (required): Task assignee
- `projectId` (required): Associated project
- `dueDate`: Task deadline
- `estimatedHours`, `actualHours`: Time tracking
- `tags`: Task categorization

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/workflow-backend
```

### MongoDB Connection

The application automatically connects to MongoDB using the `MONGODB_URI` environment variable. For local development, ensure MongoDB is running on the default port (27017).

## 🚀 Usage Examples

### Create a Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Redesign",
    "description": "Modernize company website",
    "status": "planning",
    "team": [
      {"name": "John Doe", "avatar": "https://example.com/avatar1.jpg"}
    ],
    "dueDate": "2024-12-31"
  }'
```

### Create a Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Homepage",
    "description": "Create new homepage design",
    "priority": "high",
    "assignee": {"name": "John Doe"},
    "projectId": "project_id_here",
    "estimatedHours": 8
  }'
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📝 Development

```bash
# Start development server with auto-reload
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🔒 Security Considerations

- Input validation on all endpoints
- CORS configuration for cross-origin requests
- Environment variable management
- Error handling without exposing sensitive information

## 🚧 Future Enhancements

- [ ] User authentication and authorization
- [ ] File uploads for project assets
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] API rate limiting
- [ ] Webhook support
- [ ] Multi-tenant architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the API documentation
2. Review the error logs
3. Ensure MongoDB is running
4. Verify environment variables are set correctly

## 🔗 Dependencies

- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **Joi**: Data validation
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger
- **Dotenv**: Environment variable management

---

Built with ❤️ using Node.js and Express
