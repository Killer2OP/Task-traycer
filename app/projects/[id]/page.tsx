'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  ArrowLeft,
  FolderOpen,
  Menu
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Plan {
  _id: string
  name: string
  description: string
  project: string
  tasks: any[]
  createdAt: string
  updatedAt: string
}

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

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePlan, setShowCreatePlan] = useState(false)
  const [newPlan, setNewPlan] = useState({ name: '', description: '' })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchProject()
      fetchPlans()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)

      if (response.ok) {
        const data = await response.json()
        setProject(data.project)
      } else {
        toast.error('Failed to fetch project')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to fetch project')
    }
  }

  const fetchPlans = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/plans`)

      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
      } else {
        toast.error('Failed to fetch plans')
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast.error('Failed to fetch plans')
    } finally {
      setLoading(false)
    }
  }

  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPlan.name.trim()) {
      toast.error('Plan name is required')
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlan),
      })

      if (response.ok) {
        const data = await response.json()
        setPlans([data.plan, ...plans])
        setNewPlan({ name: '', description: '' })
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

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This will also delete all tasks in the plan.')) return

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPlans(plans.filter(plan => plan._id !== planId))
        toast.success('Plan deleted successfully!')
      } else {
        toast.error('Failed to delete plan')
      }
    } catch (error) {
      console.error('Error deleting plan:', error)
      toast.error('Failed to delete plan')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 lg:ml-72 ml-0 p-4 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Project not found
              </h2>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-72 ml-0 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {project.description || 'No description provided'}
                </p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{project.collaborators.length + 1} member{project.collaborators.length !== 0 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCreatePlan(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>New Plan</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No plans yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first plan to start organizing tasks
                </p>
                <button
                  onClick={() => setShowCreatePlan(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Plan
                </button>
              </div>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/plans/${plan._id}`)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deletePlan(plan._id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {plan.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.tasks.length} task{plan.tasks.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => router.push(`/plans/${plan._id}`)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Open Plan →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create Plan Modal */}
          {showCreatePlan && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Create New Plan
                </h2>
                
                <form onSubmit={createPlan}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter plan name"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter plan description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreatePlan(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Create Plan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}