'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Circle,
  MoreVertical,
  Tag,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed' | 'blocked' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  plan: string
  dependencies: string[]
  assignee?: {
    _id: string
    name: string
    email: string
  }
  dueDate?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface Plan {
  _id: string
  name: string
  description: string
  project: string
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

interface KanbanBoardProps {
  planId: string
}

export default function KanbanBoard({ planId }: KanbanBoardProps) {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: '',
    estimatedHours: '',
    tags: [] as string[]
  })

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-100 dark:bg-slate-700' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'blocked', title: 'Blocked', color: 'bg-red-100 dark:bg-red-900/20' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' }
  ]

  const fetchPlan = useCallback(async () => {
    try {
      const response = await fetch(`/api/plans/${planId}`)
      if (response.ok) {
        const data = await response.json()
        setPlan(data.plan)
      } else {
        toast.error('Failed to fetch plan')
      }
    } catch (error) {
      console.error('Error fetching plan:', error)
      toast.error('Failed to fetch plan')
    } finally {
      setLoading(false)
    }
  }, [planId])

  useEffect(() => {
    if (planId) {
      fetchPlan()
    }
  }, [planId, fetchPlan])

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
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
          estimatedHours: newTask.estimatedHours ? parseInt(newTask.estimatedHours) : undefined,
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
          estimatedHours: '',
          tags: []
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

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-green-500'
    }
  }

  const getTasksByStatus = (status: string) => {
    return plan?.tasks.filter(task => task.status === status) || []
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
        <p className="text-gray-600 dark:text-gray-400">
          The requested plan could not be loaded.
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {plan.name} - Kanban Board
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {plan.description || 'No description provided'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id)
          return (
            <div key={column.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              {/* Column Header */}
              <div className={`p-4 rounded-t-xl ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm px-2 py-1 rounded-full">
                    {tasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-3 min-h-[400px]">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow cursor-pointer"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', task._id)
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm leading-tight">
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <MoreVertical className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                            +{task.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-3">
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {task.estimatedHours && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimatedHours}h</span>
                          </div>
                        )}
                      </div>
                      {task.assignee && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{task.assignee.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex space-x-1">
                        {column.id !== 'todo' && (
                          <button
                            onClick={() => updateTaskStatus(task._id, 'todo')}
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Move to To Do"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                        )}
                        {column.id !== 'completed' && (
                          <button
                            onClick={() => {
                              const nextStatus = column.id === 'todo' ? 'in-progress' : 
                                               column.id === 'in-progress' ? 'completed' : 
                                               column.id === 'blocked' ? 'in-progress' : 'completed'
                              updateTaskStatus(task._id, nextStatus)
                            }}
                            className="p-1 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                            title="Move forward"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <div className="text-4xl mb-2">
                      {column.id === 'todo' ? '📝' : 
                       column.id === 'in-progress' ? '⚡' : 
                       column.id === 'blocked' ? '🚫' : '✅'}
                    </div>
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
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
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
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

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Estimated Hours (Optional)
                </label>
                <input
                  type="number"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  placeholder="Enter estimated hours"
                  min="0"
                  step="0.5"
                />
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
    </div>
  )
}
