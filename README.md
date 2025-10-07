# Task Traycer - Collaborative Project Planning Platform

A modern full-stack web application for collaborative project planning, built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS.

## 🚀 Features

### Authentication & Security
- **Secure user registration/login** with bcrypt password hashing
- **JWT session tokens** for authenticated API access
- **Protected routes** with automatic redirects
- **User session management** with persistent login state

### Project Management
- **Create, update, delete projects** with full CRUD operations
- **Project ownership** and collaboration system
- **Project descriptions** and metadata tracking
- **Collaborator management** for team projects

### Plan & Task Management
- **Hierarchical organization**: Projects → Plans → Tasks
- **Task creation** with titles, descriptions, and priorities
- **Task status tracking**: Todo, In Progress, Completed
- **Task dependencies** for complex workflows
- **Due date management** with calendar integration
- **Task assignment** to team members
- **Priority levels**: Low, Medium, High

### Advanced Features
- **Plan export** to JSON format for AI integration
- **Real-time task status updates** with optimistic UI
- **Drag-and-drop task reordering** (planned)
- **Task dependency visualization** (planned)
- **Real-time collaboration** with Socket.io (planned)

### User Interface
- **Modern, responsive design** with Tailwind CSS
- **Dark/light mode toggle** with system preference detection
- **Intuitive dashboard** with project overview
- **Sidebar navigation** for quick access
- **Clean plan editor** with task management
- **Mobile-responsive** design for all screen sizes

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Next.js API Routes** for serverless functions
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database
- **MongoDB** with comprehensive schemas:
  - **Users**: Authentication and profile data
  - **Projects**: Project management and collaboration
  - **Plans**: Task organization within projects
  - **Tasks**: Individual task management with dependencies

## 📁 Project Structure

```
Task-traycer/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── projects/             # Project management APIs
│   │   ├── plans/                # Plan management APIs
│   │   └── tasks/                # Task management APIs
│   ├── dashboard/                # Dashboard page
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── projects/[id]/           # Project detail pages
│   ├── plans/[id]/              # Plan editor pages
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── AuthProvider.tsx         # Authentication context
│   ├── DashboardContent.tsx     # Dashboard main content
│   ├── PlanEditor.tsx           # Plan and task editor
│   ├── Sidebar.tsx              # Navigation sidebar
│   └── ThemeProvider.tsx        # Theme management
├── lib/                         # Utility functions
│   ├── auth.ts                  # Authentication utilities
│   ├── mongodb.ts               # Database connection
│   ├── api-utils.ts             # API helper functions
│   └── utils.ts                 # General utilities
├── models/                      # Mongoose schemas
│   ├── User.ts                  # User model
│   ├── Project.ts               # Project model
│   ├── Plan.ts                  # Plan model
│   └── Task.ts                  # Task model
├── env.example                  # Environment variables template
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **MongoDB Atlas** account (free tier available)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task-traycer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up MongoDB Atlas**
   
   **Quick Setup:**
   - Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
   - Create a new cluster (M0 free tier is perfect for development)
   - Create a database user with read/write permissions
   - Whitelist your IP address (0.0.0.0/0 for development)
   - Get your connection string
   
   **Detailed Guide:** See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for complete instructions.

4. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-traycer?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key
   NEXTAUTH_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

   The application will automatically redirect to the dashboard (no login required for demo purposes).

### First Steps

1. **Create your first project** using the "New Project" button
2. **Add plans** to organize your tasks
3. **Create tasks** with descriptions, priorities, and due dates
4. **Track progress** by updating task status
5. **Export plans** for AI integration or sharing

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Plans
- `GET /api/projects/[id]/plans` - Get project plans
- `POST /api/projects/[id]/plans` - Create new plan
- `GET /api/plans/[id]` - Get specific plan with tasks
- `PUT /api/plans/[id]` - Update plan
- `DELETE /api/plans/[id]` - Delete plan

### Tasks
- `GET /api/tasks` - Get tasks (optionally filtered by plan)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## 🎨 Customization

### Themes
The application supports light/dark mode with system preference detection. Themes are managed through the `ThemeProvider` component and stored in localStorage.

### Styling
All styling is done with Tailwind CSS. Customize the design by modifying:
- `tailwind.config.js` for theme configuration
- `app/globals.css` for global styles
- Component-specific classes in individual components

### Database Schema
Modify the Mongoose models in `/models/` to extend functionality:
- Add new fields to existing models
- Create new models for additional features
- Update API routes to handle new data structures

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- **Netlify** with serverless functions
- **Railway** for full-stack deployment
- **DigitalOcean** App Platform
- **AWS** with Amplify or Lambda

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-traycer
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages, steps to reproduce, and environment details

## 🔮 Roadmap

### Planned Features
- **Real-time collaboration** with Socket.io
- **Task dependency visualization** with drag-and-drop
- **Advanced filtering and search** for tasks and projects
- **Team management** with role-based permissions
- **Project templates** for common workflows
- **Time tracking** and productivity analytics
- **Mobile app** with React Native
- **API documentation** with Swagger/OpenAPI

### Future Enhancements
- **AI integration** for task suggestions and project planning
- **Calendar integration** for due date management
- **File attachments** for tasks and projects
- **Comments and discussions** on tasks
- **Project milestones** and progress tracking
- **Export to various formats** (PDF, Excel, etc.)

---

Built with ❤️ using Next.js, TypeScript, and MongoDB