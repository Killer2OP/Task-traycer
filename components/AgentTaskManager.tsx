'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, 
  Target, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play,
  Pause,
  Settings,
  Zap,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  BarChart3,
  MessageSquare,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Agent {
  _id: string
  name: string
  type: string
  status: string
  assignedProjects: Array<{
    _id: string
    name: string
    status: string
  }>
  assignedTasks: Array<{
    _id: string
    title: string
    status: string
    priority: string
  }>
  configuration: {
    maxConcurrentTasks: number
    autoAcceptTasks: boolean
    priorityThreshold: string
  }
  performance: {
    tasksCompleted: number
    successRate: number
  }
}

interface Project {
  _id: string
  name: string
  status: string
  tasks?: Array<{
    _id: string
    title: string
    status: string
    priority: string
  }>
}

interface Task {
  _id: string
  title: string
  status: string
  priority: string
  assignee?: string
  agentAssignee?: {
    _id: string
    name: string
    type: string
  }
  plan: {
    _id: string
    project: string
  }
  agentWorkflow?: {
    progressPercentage: number
    aiResponse?: string
    lastActivityAt?: string
    startedAt?: string
    completedAt?: string
    autoProgressUpdates: Array<{
      timestamp: string
      status: string
      note?: string
      progressPercentage: number
    }>
  }
}

export default function AgentTaskManager() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [agentsRes, projectsRes, tasksRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/projects'),
        fetch('/api/tasks')
      ])

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        setAgents(agentsData.agents)
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData.tasks)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const assignTaskToAgent = async (agentId: string, taskId: string) => {
    try {
      const response = await fetch('/api/agents/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          taskId,
          action: 'assign-task'
        }),
      })

      if (response.ok) {
        toast.success('Task assigned to agent successfully')
        fetchData() // Refresh data
      } else {
        toast.error('Failed to assign task to agent')
      }
    } catch (error) {
      console.error('Error assigning task:', error)
      toast.error('Failed to assign task to agent')
    }
  }

  const assignProjectToAgent = async (agentId: string, projectId: string) => {
    try {
      const response = await fetch('/api/agents/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          projectId,
          action: 'assign-project'
        }),
      })

      if (response.ok) {
        toast.success('Project assigned to agent successfully')
        fetchData() // Refresh data
      } else {
        toast.error('Failed to assign project to agent')
      }
    } catch (error) {
      console.error('Error assigning project:', error)
      toast.error('Failed to assign project to agent')
    }
  }

  const unassignTaskFromAgent = async (agentId: string, taskId: string) => {
    try {
      const response = await fetch('/api/agents/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          taskId,
          action: 'unassign-task'
        }),
      })

      if (response.ok) {
        toast.success('Task unassigned from agent successfully')
        fetchData() // Refresh data
      } else {
        toast.error('Failed to unassign task from agent')
      }
    } catch (error) {
      console.error('Error unassigning task:', error)
      toast.error('Failed to unassign task from agent')
    }
  }

  const unassignProjectFromAgent = async (agentId: string, projectId: string) => {
    try {
      const response = await fetch('/api/agents/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          projectId,
          action: 'unassign-project'
        }),
      })

      if (response.ok) {
        toast.success('Project unassigned from agent successfully')
        fetchData() // Refresh data
      } else {
        toast.error('Failed to unassign project from agent')
      }
    } catch (error) {
      console.error('Error unassigning project:', error)
      toast.error('Failed to unassign project from agent')
    }
  }

  // Agent workflow control functions
  const startAgentWork = async (taskId: string, agentId: string) => {
    try {
      const response = await fetch('/api/agents/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start-work',
          taskId,
          agentId
        }),
      })

      if (response.ok) {
        toast.success('Agent started working on task')
        fetchData()
      } else {
        toast.error('Failed to start agent work')
      }
    } catch (error) {
      console.error('Error starting agent work:', error)
      toast.error('Failed to start agent work')
    }
  }

  const pauseAgentWork = async (taskId: string, agentId: string, reason?: string) => {
    try {
      const response = await fetch('/api/agents/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'pause-task',
          taskId,
          agentId,
          note: reason
        }),
      })

      if (response.ok) {
        toast.success('Agent work paused')
        fetchData()
      } else {
        toast.error('Failed to pause agent work')
      }
    } catch (error) {
      console.error('Error pausing agent work:', error)
      toast.error('Failed to pause agent work')
    }
  }

  const completeAgentWork = async (taskId: string, agentId: string) => {
    try {
      const response = await fetch('/api/agents/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete-task',
          taskId,
          agentId
        }),
      })

      if (response.ok) {
        toast.success('Task completed by agent')
        fetchData()
      } else {
        toast.error('Failed to complete task')
      }
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error('Failed to complete task')
    }
  }

  const updateTaskProgress = async (taskId: string, agentId: string, progress: number, note?: string) => {
    try {
      const response = await fetch('/api/agents/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-progress',
          taskId,
          agentId,
          progress,
          note
        }),
      })

      if (response.ok) {
        toast.success('Task progress updated')
        fetchData()
      } else {
        toast.error('Failed to update task progress')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update task progress')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Agent Task Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Assign tasks and projects to AI agents for automated completion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agents List */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Available Agents
          </h2>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                        {agent.type.replace('-', ' ')} • {agent.status}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAgent(agent)
                      setShowAssignmentModal(true)
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Manage assignments"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {agent.assignedProjects.length}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {agent.assignedTasks.length}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Tasks</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Completed: {agent.performance.tasksCompleted}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Success: {agent.performance.successRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Tasks */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Available Tasks
          </h2>
          <div className="space-y-4">
            {tasks.filter(task => task.status === 'todo' || task.status === 'in-progress').map((task) => (
              <div key={task._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <FolderOpen className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Project: {projects.find(p => p._id === task.plan.project)?.name || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      {task.agentAssignee ? (
                        <div className="flex items-center space-x-2 min-w-0">
                          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            Assigned to {task.agentAssignee.name}
                          </span>
                          {task.agentWorkflow && (
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${task.agentWorkflow.progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {task.agentWorkflow.progressPercentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Unassigned</span>
                          <button
                            onClick={() => {
                              if (agents.length > 0) {
                                const availableAgent = agents.find(a => a.status === 'active' && a.assignedTasks.length < a.configuration.maxConcurrentTasks)
                                if (availableAgent) {
                                  assignTaskToAgent(availableAgent._id, task._id)
                                } else {
                                  toast.error('No available agents to assign this task')
                                }
                              } else {
                                toast.error('No agents available')
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0"
                            title="Auto-assign to available agent"
                          >
                            <Target className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Agent Workflow Controls */}
                  {task.agentAssignee && task.agentWorkflow && (
                    <div className="mt-3">
                      {task.agentWorkflow.aiResponse && (
                        <div className="mb-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400">
                            <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="break-words leading-relaxed">{task.agentWorkflow.aiResponse}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-end space-x-1">
                        {task.status === 'todo' && (
                          <button
                            onClick={() => startAgentWork(task._id, task.agentAssignee!._id)}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            title="Start agent work"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {task.status === 'in-progress' && (
                          <>
                            <button
                              onClick={() => pauseAgentWork(task._id, task.agentAssignee!._id)}
                              className="p-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                              title="Pause agent work"
                            >
                              <PauseCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => completeAgentWork(task._id, task.agentAssignee!._id)}
                              className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                              title="Complete task"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {task.status === 'blocked' && (
                          <button
                            onClick={() => startAgentWork(task._id, task.agentAssignee!._id)}
                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Resume agent work"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Manage {selectedAgent.name} Assignments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Assigned Projects */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Assigned Projects
                </h3>
                <div className="space-y-3">
                  {selectedAgent.assignedProjects.map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{project.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">{project.status}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => unassignProjectFromAgent(selectedAgent._id, project._id)}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Unassign project"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Tasks */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Assigned Tasks
                </h3>
                <div className="space-y-3">
                  {selectedAgent.assignedTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Target className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{task.title}</div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => unassignTaskFromAgent(selectedAgent._id, task._id)}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Unassign task"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
