'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  Download,
  ArrowUp,
  ArrowDown,
  Calendar,
  User,
  Link,
  Grid3X3,
  List
} from 'lucide-react'
import toast from 'react-hot-toast'
import KanbanBoard from './KanbanBoard'

interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  plan: string
  dependencies: string[]
  assignee?: {
    _id: string
    name: string
    email: string
  }
  dueDate?: string
  createdAt: string
  updatedAt: string
}

interface Plan {
  _id: string
  name: string
  description?: string
  project: string
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

export default function PlanEditor() {
  const params = useParams()
  const router = useRouter()
  const planId = params.id as string
  
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingPlan, setEditingPlan] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
    assigneeId: '',
    dependencies: [] as string[]
  })

  useEffect(() => {
    if (planId) {
      fetchPlan()
    }
  }, [planId])

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/plans/${planId}`)

      if (response.ok) {
        const data = await response.json()
        setPlan(data.plan)
      } else {
        toast.error('Failed to fetch plan')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching plan:', error)
      toast.error('Failed to fetch plan')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTask,
          planId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPlan(prev => prev ? {
          ...prev,
          tasks: [...prev.tasks, data.task]
        } : null)
        setNewTask({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          assigneeId: '',
          dependencies: []
        })
        setShowCreateTask(false)
        toast.success('Task created successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    }
  }

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const data = await response.json()
        setPlan(prev => prev ? {
          ...prev,
          tasks: prev.tasks.map(task => 
            task._id === taskId ? data.task : task
          )
        } : null)
        toast.success('Task updated successfully!')
      } else {
        toast.error('Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPlan(prev => prev ? {
          ...prev,
          tasks: prev.tasks.filter(task => task._id !== taskId)
        } : null)
        toast.success('Task deleted successfully!')
      } else {
        toast.error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingTask) return

    try {
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate,
          assigneeId: editingTask.assignee?._id,
          dependencies: editingTask.dependencies
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPlan(prev => prev ? {
          ...prev,
          tasks: prev.tasks.map(task => 
            task._id === editingTask._id ? data.task : task
          )
        } : null)
        setEditingTask(null)
        toast.success('Task updated successfully!')
      } else {
        toast.error('Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  const updatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!plan) return

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: plan.name,
          description: plan.description
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPlan(data.plan)
        toast.success('Plan updated successfully!')
      } else {
        toast.error('Failed to update plan')
      }
    } catch (error) {
      console.error('Error updating plan:', error)
      toast.error('Failed to update plan')
    }
  }

  const exportPlan = () => {
    if (!plan) return

    const exportData = {
      plan: {
        name: plan.name,
        description: plan.description,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      },
      tasks: plan.tasks.map(task => ({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee?.name,
        dependencies: task.dependencies
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${plan.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Plan exported successfully!')
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900'
      default:
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Plan not found
        </h2>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {editingPlan ? (
                <form onSubmit={updatePlan} className="space-y-4">
                  <input
                    type="text"
                    value={plan?.name || ''}
                    onChange={(e) => setPlan(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none text-slate-900 dark:text-white w-full"
                    placeholder="Plan name"
                    required
                  />
                  <textarea
                    value={plan?.description || ''}
                    onChange={(e) => setPlan(prev => prev ? { ...prev, description: e.target.value } : null)}
                    className="text-slate-600 dark:text-slate-400 bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none w-full resize-none"
                    placeholder="Plan description"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPlan(false)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {plan?.name}
                    </h1>
                    <button
                      onClick={() => setEditingPlan(true)}
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {plan?.description || 'No description provided'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors font-medium ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors font-medium ${
                    viewMode === 'kanban' 
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>Kanban</span>
                </button>
              </div>
              <button
                onClick={exportPlan}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowCreateTask(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {viewMode === 'kanban' ? (
          <KanbanBoard planId={planId} />
        ) : (
          /* Tasks List */
          <div className="space-y-4">
            {plan.tasks.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first task to get started
                </p>
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Task
                </button>
              </div>
            ) : (
              plan.tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <button
                        onClick={() => updateTaskStatus(task._id, 
                          task.status === 'completed' ? 'todo' : 
                          task.status === 'todo' ? 'in-progress' : 'completed'
                        )}
                        className="mt-1 hover:scale-110 transition-transform"
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`text-lg font-semibold ${
                            task.status === 'completed' 
                              ? 'line-through text-slate-500 dark:text-slate-400' 
                              : 'text-slate-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-6 text-sm">
                          {task.dueDate && (
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {task.assignee && (
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                              <User className="h-4 w-4" />
                              <span>{task.assignee.name}</span>
                            </div>
                          )}
                          
                          {task.dependencies.length > 0 && (
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                              <Link className="h-4 w-4" />
                              <span>{task.dependencies.length} dependencies</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Create New Task
            </h2>
            
            <form onSubmit={createTask}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Description (Optional)
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors resize-none"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Edit Task
            </h2>
            
            <form onSubmit={updateTask}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Description (Optional)
                </label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors resize-none"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
