# Task Traycer - AI-Powered Project Planning Platform

A modern full-stack web application for collaborative project planning with AI agent integration, built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS.

## 🚀 Features

### Core Project Management
- **Create, update, delete projects** with full CRUD operations
- **Project ownership** and collaboration system
- **Project descriptions** and metadata tracking
- **Collaborator management** for team projects
- **Project templates** for quick project setup

### Plan & Task Management
- **Hierarchical organization**: Projects → Plans → Tasks
- **Task creation** with titles, descriptions, and priorities
- **Task status tracking**: Todo, In Progress, Completed, Blocked
- **Task dependencies** for complex workflows
- **Due date management** with calendar integration
- **Task assignment** to team members
- **Priority levels**: Low, Medium, High, Urgent

### AI Agent Integration
- **AI Agent Management** with custom agent creation
- **Agent Task Assignment** for automated task handling
- **Agent Workflow Visualization** for process optimization
- **Agent Performance Analytics** and efficiency tracking
- **Agent Settings** and configuration management

### Analytics & Insights
- **Comprehensive Analytics Dashboard** with project metrics
- **Task completion rates** and productivity trends
- **Agent performance metrics** and efficiency analysis
- **Project progress tracking** with visual indicators
- **Time-saving calculations** and productivity insights

### User Interface
- **Modern, responsive design** with Tailwind CSS
- **Dark/light mode toggle** with system preference detection
- **Intuitive dashboard** with project overview
- **Sidebar navigation** for quick access
- **Clean plan editor** with task management
- **Mobile-responsive** design for all screen sizes
- **Real-time updates** with optimistic UI

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
  - **Agents**: AI agent configuration and management
  - **Milestones**: Project milestone tracking
  - **Comments**: Task and project comments
  - **ProjectTemplates**: Reusable project templates
  - **UserSettings**: User preferences and API keys

## 📁 Project Structure

```
Task-traycer/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── projects/             # Project management APIs
│   │   ├── plans/                # Plan management APIs
│   │   ├── tasks/                # Task management APIs
│   │   ├── agents/               # AI agent management APIs
│   │   ├── analytics/            # Analytics and metrics APIs
│   │   ├── collaborators/        # Collaboration APIs
│   │   ├── milestones/           # Milestone tracking APIs
│   │   ├── templates/            # Project template APIs
│   │   ├── settings/             # User settings APIs
│   │   └── activity/             # Activity tracking APIs
│   ├── dashboard/                # Dashboard page
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
│   ├── ThemeProvider.tsx        # Theme management
│   ├── AnalyticsDashboard.tsx   # Analytics dashboard
│   ├── AgentTab.tsx             # AI agent management
│   ├── AgentTaskManager.tsx     # Agent task management
│   ├── AgentWorkflowVisualization.tsx # Workflow visualization
│   ├── ProjectsTab.tsx          # Projects management tab
│   ├── ProjectTemplates.tsx     # Project templates
│   ├── SettingsTab.tsx          # Settings management
│   └── KanbanBoard.tsx          # Kanban board component
├── lib/                         # Utility functions
│   ├── auth.ts                  # Authentication utilities
│   ├── mongodb.ts               # Database connection
│   ├── api-utils.ts             # API helper functions
│   ├── utils.ts                 # General utilities
│   └── validation.ts            # Data validation utilities
├── models/                      # Mongoose schemas
│   ├── User.ts                  # User model
│   ├── Project.ts               # Project model
│   ├── Plan.ts                  # Plan model
│   ├── Task.ts                  # Task model
│   ├── Agent.ts                 # AI agent model
│   ├── Milestone.ts             # Milestone model
│   ├── Comment.ts               # Comment model
│   ├── ProjectTemplate.ts       # Project template model
│   └── UserSettings.ts          # User settings model
├── env.example                  # Environment variables template
├── MONGODB_ATLAS_SETUP.md       # MongoDB Atlas setup guide
├── setup.bat / setup.sh         # Setup scripts
├── setup-atlas.bat / setup-atlas.sh # MongoDB Atlas setup scripts
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

   The application will automatically redirect to the dashboard (demo mode with mock authentication).

### First Steps

1. **Create your first project** using the "New Project" button
2. **Add plans** to organize your tasks
3. **Create tasks** with descriptions, priorities, and due dates
4. **Set up AI agents** for automated task management
5. **Track progress** using the analytics dashboard
6. **Use project templates** for quick project setup
7. **Manage collaborators** for team projects

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
- `GET /api/projects/[id]/plans` - Get project plans
- `POST /api/projects/[id]/plans` - Create new plan

### Plans
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create new plan
- `GET /api/plans/[id]` - Get specific plan with tasks
- `PUT /api/plans/[id]` - Update plan
- `DELETE /api/plans/[id]` - Delete plan

### Tasks
- `GET /api/tasks` - Get tasks (optionally filtered by plan)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### AI Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/[id]` - Get specific agent
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent
- `POST /api/agents/assign` - Assign tasks to agents
- `GET /api/agents/workflow` - Get agent workflow data

### Analytics & Activity
- `GET /api/analytics` - Get analytics data
- `GET /api/activity` - Get recent activity feed

### Collaboration
- `GET /api/collaborators` - Get collaborators
- `POST /api/collaborators` - Add collaborator

### Templates & Settings
- `GET /api/templates` - Get project templates
- `POST /api/templates` - Create template
- `GET /api/templates/[id]` - Get specific template
- `POST /api/templates/[id]/use` - Use template for new project
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

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

### Current Features ✅
- **AI Agent Integration** - Create and manage AI agents for task automation
- **Analytics Dashboard** - Comprehensive project and agent performance metrics
- **Project Templates** - Reusable templates for quick project setup
- **Collaboration System** - Team management and project sharing
- **Task Management** - Full CRUD operations with dependencies and priorities
- **Real-time Updates** - Optimistic UI with instant feedback

### Planned Features
- **Real-time collaboration** with Socket.io for live updates
- **Advanced task filtering** and search capabilities
- **Calendar integration** for due date management
- **File attachments** for tasks and projects
- **Comments and discussions** on tasks and projects
- **Mobile app** with React Native
- **API documentation** with Swagger/OpenAPI
- **Advanced AI features** for intelligent task suggestions

### Future Enhancements
- **Time tracking** and detailed productivity analytics
- **Advanced workflow automation** with custom triggers
- **Integration with external tools** (Slack, GitHub, etc.)
- **Export to various formats** (PDF, Excel, etc.)
- **Advanced reporting** with custom dashboards
- **Multi-language support** for international teams

---

Built with ❤️ using Next.js, TypeScript, and MongoDB