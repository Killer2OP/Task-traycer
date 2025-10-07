'use client'

import { useState, useEffect } from 'react'
import { Plus, FolderOpen, Calendar, Users, Clock, CheckCircle, TrendingUp, Zap, RefreshCw, BarChart3, Activity, Menu, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Sidebar from './Sidebar'
import AnalyticsDashboard from './AnalyticsDashboard'
import ProjectTemplates from './ProjectTemplates'
import ProjectsTab from './ProjectsTab'
import AgentTab from './AgentTab'
import AgentWorkflowVisualization from './AgentWorkflowVisualization'
import SettingsTab from './SettingsTab'

interface Project {
  _id: string
  name: string
  description: string
  owner: {
    _id: string
    name: string
    email: string
  }
  collaborators: Array<{
    _id: string
    name: string
    email: string
  }>
  createdAt: string
  updatedAt: string
}

interface ActivityItem {
  id: string
  type: 'task' | 'project' | 'plan'
  title: string
  status: string
  priority: string
  timestamp: string
  projectName?: string
  planName?: string
  assignee?: {
    name: string
    email: string
  }
}

interface Plan {
  _id: string
  name: string
  description: string
  project: {
    _id: string
    name: string
    description: string
  }
  tasks: any[]
  createdAt: string
  updatedAt: string
}

interface Collaborator {
  _id: string
  name: string
  email: string
  projects: Array<{
    _id: string
    name: string
    role: 'owner' | 'collaborator'
  }>
}

interface AnalyticsData {
  overview: {
    totalProjects: number
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    blockedTasks: number
    totalMilestones: number
    completedMilestones: number
    overdueMilestones: number
    completionRate: number
    efficiency: number
    timeSaved: number
    productivityTrend: number
  }
  agents: {
    totalAgents: number
    activeAgents: number
    totalAgentTasks: number
    agentCompletedTasks: number
    agentInProgressTasks: number
    agentCompletionRate: number
    totalAgentHours: number
    averageAgentEfficiency: number
  }
}

export default function DashboardContent() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreatePlan, setShowCreatePlan] = useState(false)
  const [showAddCollaborator, setShowAddCollaborator] = useState(false)
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '',
    priority: 'medium' as const,
    startDate: '',
    endDate: '',
    budget: '',
    tags: [] as string[],
    template: ''
  })
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    projectId: ''
  })
  const [newCollaborator, setNewCollaborator] = useState({
    email: '',
    projectId: ''
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    fetchProjects()
    fetchActivities()
    fetchAnalytics()
  }, [])

  useEffect(() => {
    if (activeTab === 'plans') {
      fetchPlans()
    } else if (activeTab === 'collaborators') {
      fetchCollaborators()
    }
  }, [activeTab])

  useEffect(() => {
    // Handle URL parameters for tab switching
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tab = urlParams.get('tab')
      if (tab && ['dashboard', 'analytics', 'collaborators', 'plans', 'templates', 'projects', 'agents', 'workflow', 'settings'].includes(tab)) {
        setActiveTab(tab)
      } else {
        setActiveTab('dashboard') // Default to dashboard
      }
    }
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')

      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      } else {
        toast.error('Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activity?limit=5')

      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      } else {
        console.error('Failed to fetch activities:', response.status, response.statusText)
        setActivities([]) // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?timeframe=30d')
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        console.error('Failed to fetch analytics:', response.status, response.statusText)
        setAnalytics(null)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalytics(null)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await Promise.all([
      fetchProjects(),
      fetchActivities(),
      fetchAnalytics()
    ])
    setLoading(false)
    toast.success('Data refreshed successfully')
  }

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')

      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      } else {
        toast.error('Failed to fetch plans')
        setPlans([])
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast.error('Failed to fetch plans')
      setPlans([])
    }
  }

  const fetchCollaborators = async () => {
    try {
      const response = await fetch('/api/collaborators')

      if (response.ok) {
        const data = await response.json()
        setCollaborators(data.collaborators || [])
      } else {
        toast.error('Failed to fetch collaborators')
        setCollaborators([])
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error)
      toast.error('Failed to fetch collaborators')
      setCollaborators([])
    }
  }

  const seedSampleData = async () => {
    try {
      const response = await fetch('/api/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Sample data created successfully!')
        // Refresh both projects and activities
        fetchProjects()
        fetchActivities()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create sample data')
      }
    } catch (error) {
      console.error('Error creating sample data:', error)
      toast.error('Failed to create sample data')
    }
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newProject.name.trim()) {
      toast.error('Project name is required')
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })

      if (response.ok) {
        const data = await response.json()
        setProjects([data.project, ...projects])
        setNewProject({ 
          name: '', 
          description: '',
          priority: 'medium',
          startDate: '',
          endDate: '',
          budget: '',
          tags: [],
          template: ''
        })
        setShowCreateProject(false)
        // Refresh activities after creating a project
        fetchActivities()
        toast.success('Project created successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    }
  }

  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPlan.name.trim()) {
      toast.error('Plan name is required')
      return
    }

    if (!newPlan.projectId) {
      toast.error('Please select a project')
      return
    }

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlan),
      })

      if (response.ok) {
        const data = await response.json()
        setPlans([data.plan, ...plans])
        setNewPlan({
          name: '',
          description: '',
          projectId: ''
        })
        setShowCreatePlan(false)
        toast.success('Plan created successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create plan')
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      toast.error('Failed to create plan')
    }
  }

  const addCollaborator = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCollaborator.email.trim()) {
      toast.error('Email is required')
      return
    }

    if (!newCollaborator.projectId) {
      toast.error('Please select a project')
      return
    }

    try {
      const response = await fetch('/api/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollaborator),
      })

      if (response.ok) {
        setNewCollaborator({
          email: '',
          projectId: ''
        })
        setShowAddCollaborator(false)
        toast.success('Collaborator added successfully!')
        fetchCollaborators() // Refresh collaborators list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to add collaborator')
      }
    } catch (error) {
      console.error('Error adding collaborator:', error)
      toast.error('Failed to add collaborator')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'active':
        return 'bg-blue-500'
      case 'todo':
        return 'bg-slate-400'
      case 'blocked':
        return 'bg-red-500'
      case 'planning':
        return 'bg-yellow-500'
      case 'on-hold':
        return 'bg-orange-500'
      case 'cancelled':
        return 'bg-gray-500'
      default:
        return 'bg-slate-400'
    }
  }

  const getActivityStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return 'pending'
      case 'in-progress':
        return 'in progress'
      case 'completed':
        return 'completed'
      case 'blocked':
        return 'blocked'
      case 'cancelled':
        return 'cancelled'
      case 'planning':
        return 'planning'
      case 'active':
        return 'active'
      case 'on-hold':
        return 'on hold'
      case 'draft':
        return 'draft'
      case 'archived':
        return 'archived'
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'urgent priority'
      case 'high':
        return 'high priority'
      case 'medium':
        return 'medium priority'
      case 'low':
        return 'low priority'
      default:
        return `${priority} priority`
    }
  }

  const handleActivityClick = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'task':
        // Navigate to the project page where the task belongs
        if (activity.projectName) {
          const project = projects.find(p => p.name === activity.projectName)
          if (project) {
            router.push(`/projects/${project._id}`)
          }
        }
        break
      case 'project':
        router.push(`/projects/${activity.id}`)
        break
      case 'plan':
        router.push(`/plans/${activity.id}`)
        break
    }
  }

  const renderAnalyticsContent = () => (
    <>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Project Completion</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">75%</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Team Productivity</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">92%</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Time Saved</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">24h</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Project Progress</h3>
        <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Chart visualization coming soon...</p>
        </div>
      </div>
    </>
  )

  const renderCollaboratorsContent = () => (
    <>
      {/* Add Collaborator Button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowAddCollaborator(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Add Collaborator</span>
        </button>
      </div>

      {/* Collaborators List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No collaborators yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Add collaborators to your projects to work together.</p>
            <button 
              onClick={() => setShowAddCollaborator(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Collaborator
            </button>
          </div>
        ) : (
          collaborators.map((collaborator) => (
            <div key={collaborator._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{collaborator.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{collaborator.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Projects:</p>
                {collaborator.projects.map((project) => (
                  <div key={project._id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-2 rounded-lg">
                    <span className="text-sm text-slate-900 dark:text-white">{project.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.role === 'owner' 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    }`}>
                      {project.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )

  const renderPlansContent = () => (
    <>
      {/* Create Plan Button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowCreatePlan(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No plans yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Create your first plan to get started with project planning.</p>
            <button 
              onClick={() => setShowCreatePlan(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Plan
            </button>
          </div>
        ) : (
          plans.map((plan) => (
            <div 
              key={plan._id} 
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/plans/${plan._id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Created {formatDate(plan.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                {plan.description || 'No description provided'}
              </p>
              
              <div className="mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Project:</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{plan.project.name}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Activity className="h-4 w-4" />
                  <span>{plan.tasks.length} tasks</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  View Plan →
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className={`main-content-area transition-all duration-300 min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ${sidebarOpen ? (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72') : 'ml-0'}`}>
        {/* Content Wrapper */}
        <div className="main-content-wrapper w-full max-w-full">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
            <div className="px-4 lg:px-8 py-4 lg:py-6">
              <div className="flex justify-between items-center gap-4 min-w-0">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex-shrink-0"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white truncate">
                      {activeTab === 'dashboard' ? 'Dashboard' : 
                       activeTab === 'analytics' ? 'Analytics' :
                       activeTab === 'collaborators' ? 'Collaborators' :
                       activeTab === 'plans' ? 'Plans' :
                       activeTab === 'templates' ? 'Templates' :
                       activeTab === 'projects' ? 'Projects' :
                       activeTab === 'agents' ? 'Agents' :
                       activeTab === 'workflow' ? 'Agent Workflow' :
                       activeTab === 'settings' ? 'Settings' : 'Traycer'}
                    </h1>
                    <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 mt-1 truncate">
                      AI-Powered Development Planning
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                  <button className="hidden sm:flex items-center space-x-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 lg:px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">Planning Layer</span>
                  </button>
                  <button 
                    onClick={refreshData}
                    disabled={loading}
                    className="p-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>


      {/* Render content based on active tab */}
      {activeTab === 'dashboard' && (
        <div className="content-section p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {loading && !analytics ? (
              // Loading skeleton
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                        <div className="p-2 lg:p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <div className="h-5 w-5 lg:h-6 lg:w-6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Actual stats cards
              <>
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Tasks</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    {analytics?.overview.totalTasks || 0}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {analytics?.overview.completedTasks || 0} completed
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">In Progress</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    {analytics?.overview.inProgressTasks || 0}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {analytics?.overview.totalTasks - analytics?.overview.completedTasks - analytics?.overview.inProgressTasks || 0} pending
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Agents</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    {analytics?.agents.activeAgents || 0}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {analytics?.agents.totalAgents - analytics?.agents.activeAgents || 0} idle
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Efficiency</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    {analytics?.overview.completionRate || 0}%
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Completion rate</p>
                </div>
                <div className="p-2 lg:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowCreateProject(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Create Project</span>
              </button>
              <button 
                onClick={() => {
                  // For now, show a toast message - in a real app, this would open a modal
                  toast.success('Collaborator feature coming soon!')
                }}
                className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                <Users className="h-5 w-5" />
                <span>Add Collaborator</span>
              </button>
              <button 
                onClick={() => {
                  // For now, show a toast message - in a real app, this would open a modal
                  toast.success('Create Plan feature coming soon!')
                }}
                className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                <Calendar className="h-5 w-5" />
                <span>Create Plan</span>
              </button>
              {projects.length === 0 && (
                <button 
                  onClick={seedSampleData}
                  className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-6 py-3 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors font-medium"
                >
                  <Zap className="h-5 w-5" />
                  <span>Load Sample Data</span>
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
              <button
                onClick={fetchActivities}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Refresh activities"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      onClick={() => handleActivityClick(activity)}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                    >
                      <div className={`w-2 h-2 ${getActivityStatusColor(activity.status)} rounded-full`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {getActivityStatusText(activity.status)} • {getPriorityText(activity.priority)}
                          {activity.projectName && ` • ${activity.projectName}`}
                          {activity.planName && ` • ${activity.planName}`}
                        </p>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No recent activity</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Start by creating projects and tasks to see activity here</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setShowCreateProject(true)}
                      className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create Project</span>
                    </button>
                    <button
                      onClick={seedSampleData}
                      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <Zap className="h-5 w-5" />
                      <span>Load Sample Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Your Projects</h2>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {projects.filter(project => project && project._id).map((project) => (
                  <div
                    key={project._id}
                    onClick={() => router.push(`/projects/${project._id}`)}
                    className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Created {formatDate(project.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                      {project.description || 'No description provided'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Users className="h-4 w-4" />
                      <span>{(project.collaborators?.length || 0) + 1} member{(project.collaborators?.length || 0) !== 0 ? 's' : ''}</span>
                    </div>
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FolderOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No projects yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Get started by creating your first project</p>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Project</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="content-section w-full max-w-full overflow-x-hidden">
          <AnalyticsDashboard />
        </div>
      )}
      
      {activeTab === 'collaborators' && (
        <div className="content-section p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          {renderCollaboratorsContent()}
        </div>
      )}
      
      {activeTab === 'plans' && (
        <div className="content-section p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          {renderPlansContent()}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="content-section w-full max-w-full overflow-x-hidden">
          <ProjectTemplates />
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="content-section w-full max-w-full overflow-x-hidden">
          <ProjectsTab />
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="content-section w-full max-w-full overflow-x-hidden">
          <AgentTab />
        </div>
      )}

      {activeTab === 'workflow' && (
        <div className="content-section w-full max-w-full overflow-x-hidden">
          <AgentWorkflowVisualization />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="content-section w-full max-w-full overflow-x-hidden">
          <SettingsTab />
        </div>
      )}

        {/* Create Project Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Create New Project
              </h2>
              
              <form onSubmit={createProject}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Priority
                    </label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors resize-none"
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                      placeholder="Enter budget amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={newProject.tags.join(', ')}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateProject(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Plan Modal */}
        {showCreatePlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Create New Plan
              </h2>
              
              <form onSubmit={createPlan}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="Enter plan name"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Project *
                  </label>
                  <select
                    value={newPlan.projectId}
                    onChange={(e) => setNewPlan({ ...newPlan, projectId: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Description
                  </label>
                  <textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="Enter plan description"
                    rows={4}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreatePlan(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Create Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Collaborator Modal */}
        {showAddCollaborator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Add Collaborator
              </h2>
              
              <form onSubmit={addCollaborator}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="Enter collaborator's email"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Project *
                  </label>
                  <select
                    value={newCollaborator.projectId}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, projectId: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCollaborator(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Add Collaborator
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
