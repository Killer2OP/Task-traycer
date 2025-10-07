'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  Users, 
  Zap,
  Activity,
  Target,
  Brain,
  Code,
  Bug,
  FileText,
  TestTube,
  Wrench
} from 'lucide-react'
import toast from 'react-hot-toast'
import AgentTaskManager from './AgentTaskManager'

interface Agent {
  _id: string
  name: string
  description: string
  type: 'code-reviewer' | 'task-executor' | 'bug-fixer' | 'documentation' | 'testing' | 'custom'
  status: 'active' | 'idle' | 'busy' | 'offline'
  capabilities: string[]
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
    workingHours: {
      start: string
      end: string
    }
    autoAcceptTasks: boolean
    priorityThreshold: string
    skills: string[]
    aiModel: string
    customInstructions?: string
  }
  performance: {
    tasksCompleted: number
    averageCompletionTime: number
    successRate: number
    lastActive: string
  }
  createdAt: string
  updatedAt: string
}

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'code-reviewer':
      return <Code className="h-5 w-5" />
    case 'task-executor':
      return <Target className="h-5 w-5" />
    case 'bug-fixer':
      return <Bug className="h-5 w-5" />
    case 'documentation':
      return <FileText className="h-5 w-5" />
    case 'testing':
      return <TestTube className="h-5 w-5" />
    default:
      return <Wrench className="h-5 w-5" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'busy':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'idle':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'offline':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export default function AgentTab() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateAgent, setShowCreateAgent] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [activeView, setActiveView] = useState<'agents' | 'management'>('agents')
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'task-executor' as const,
    capabilities: [] as string[],
    configuration: {
      maxConcurrentTasks: 3,
      workingHours: {
        start: '09:00',
        end: '17:00',
      },
      autoAcceptTasks: false,
      priorityThreshold: 'medium' as const,
      skills: [] as string[],
      aiModel: 'gpt-4',
      customInstructions: '',
    }
  })

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents)
      } else {
        toast.error('Failed to fetch agents')
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast.error('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  const createAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAgent.name.trim()) {
      toast.error('Agent name is required')
      return
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      })

      if (response.ok) {
        const data = await response.json()
        setAgents([data.agent, ...agents])
        setNewAgent({
          name: '',
          description: '',
          type: 'task-executor',
          capabilities: [],
          configuration: {
            maxConcurrentTasks: 3,
            workingHours: {
              start: '09:00',
              end: '17:00',
            },
            autoAcceptTasks: false,
            priorityThreshold: 'medium',
            skills: [],
            aiModel: 'gpt-4',
            customInstructions: '',
          }
        })
        setShowCreateAgent(false)
        toast.success('Agent created successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create agent')
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error('Failed to create agent')
    }
  }

  const updateAgentStatus = async (agentId: string, status: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const data = await response.json()
        setAgents(agents.map(agent => 
          agent._id === agentId ? data.agent : agent
        ))
        toast.success(`Agent ${status === 'active' ? 'activated' : 'deactivated'} successfully`)
      } else {
        toast.error('Failed to update agent status')
      }
    } catch (error) {
      console.error('Error updating agent status:', error)
      toast.error('Failed to update agent status')
    }
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return
    }

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAgents(agents.filter(agent => agent._id !== agentId))
        toast.success('Agent deleted successfully')
      } else {
        toast.error('Failed to delete agent')
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast.error('Failed to delete agent')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (activeView === 'management') {
    return <AgentTaskManager />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              AI Agents
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create and manage AI agents to automate your project tasks
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveView('management')}
              className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              <Target className="h-4 w-4" />
              <span>Task Management</span>
            </button>
            <button
              onClick={() => setShowCreateAgent(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Create Agent</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Agents</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{agents.length}</p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {agents.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tasks Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {agents.reduce((sum, agent) => sum + agent.performance.tasksCompleted, 0)}
                </p>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Avg Success Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {agents.length > 0 
                    ? Math.round(agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length)
                    : 0}%
                </p>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    {getAgentIcon(agent.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                      {agent.type.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateAgentStatus(agent._id, agent.status === 'active' ? 'idle' : 'active')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      title={agent.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setEditingAgent(agent)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteAgent(agent._id)}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                {agent.description || 'No description provided'}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Projects</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {agent.assignedProjects.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Active Tasks</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {agent.assignedTasks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Tasks Completed</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {agent.performance.tasksCompleted}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Success Rate</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {agent.performance.successRate}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Last active: {formatDate(agent.performance.lastActive)}</span>
                <span>Model: {agent.configuration.aiModel}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bot className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No agents yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Create your first AI agent to automate project tasks</p>
          <button
            onClick={() => setShowCreateAgent(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Create Agent</span>
          </button>
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Create New Agent
            </h2>
            
            <form onSubmit={createAgent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="Enter agent name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Agent Type *
                  </label>
                  <select
                    value={newAgent.type}
                    onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value as any })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  >
                    <option value="task-executor">Task Executor</option>
                    <option value="code-reviewer">Code Reviewer</option>
                    <option value="bug-fixer">Bug Fixer</option>
                    <option value="documentation">Documentation</option>
                    <option value="testing">Testing</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Description
                </label>
                <textarea
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors resize-none"
                  placeholder="Enter agent description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Max Concurrent Tasks
                  </label>
                  <input
                    type="number"
                    value={newAgent.configuration.maxConcurrentTasks}
                    onChange={(e) => setNewAgent({ 
                      ...newAgent, 
                      configuration: { 
                        ...newAgent.configuration, 
                        maxConcurrentTasks: parseInt(e.target.value) 
                      } 
                    })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    min="1"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Priority Threshold
                  </label>
                  <select
                    value={newAgent.configuration.priorityThreshold}
                    onChange={(e) => setNewAgent({ 
                      ...newAgent, 
                      configuration: { 
                        ...newAgent.configuration, 
                        priorityThreshold: e.target.value as any 
                      } 
                    })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Working Hours Start
                  </label>
                  <input
                    type="time"
                    value={newAgent.configuration.workingHours.start}
                    onChange={(e) => setNewAgent({ 
                      ...newAgent, 
                      configuration: { 
                        ...newAgent.configuration, 
                        workingHours: { 
                          ...newAgent.configuration.workingHours, 
                          start: e.target.value 
                        } 
                      } 
                    })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Working Hours End
                  </label>
                  <input
                    type="time"
                    value={newAgent.configuration.workingHours.end}
                    onChange={(e) => setNewAgent({ 
                      ...newAgent, 
                      configuration: { 
                        ...newAgent.configuration, 
                        workingHours: { 
                          ...newAgent.configuration.workingHours, 
                          end: e.target.value 
                        } 
                      } 
                    })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  AI Model
                </label>
                <select
                  value={newAgent.configuration.aiModel}
                  onChange={(e) => setNewAgent({ 
                    ...newAgent, 
                    configuration: { 
                      ...newAgent.configuration, 
                      aiModel: e.target.value 
                    } 
                  })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Custom Instructions
                </label>
                <textarea
                  value={newAgent.configuration.customInstructions}
                  onChange={(e) => setNewAgent({ 
                    ...newAgent, 
                    configuration: { 
                      ...newAgent.configuration, 
                      customInstructions: e.target.value 
                    } 
                  })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors resize-none"
                  placeholder="Enter custom instructions for the agent"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAgent(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
