'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Zap,
  Activity,
  TrendingUp,
  Brain,
  Cpu,
  MessageSquare,
  BarChart3,
  Sparkles,
  Target,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AgentWorkflow {
  _id: string
  title: string
  status: string
  priority: string
  agentAssignee: {
    _id: string
    name: string
    type: string
  }
  agentWorkflow: {
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

interface Agent {
  _id: string
  name: string
  type: string
  status: string
  performance: {
    tasksCompleted: number
    efficiencyScore: number
    currentWorkload: number
  }
}

export default function AgentWorkflowVisualization() {
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchWorkflows()
    
    if (autoRefresh) {
      const interval = setInterval(fetchWorkflows, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchWorkflows = async () => {
    try {
      const [workflowsRes, agentsRes] = await Promise.all([
        fetch('/api/agents/workflow'),
        fetch('/api/agents')
      ])

      if (workflowsRes.ok) {
        const workflowsData = await workflowsRes.json()
        setWorkflows(workflowsData.activeWorkflows || [])
      }

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        setAgents(agentsData.agents || [])
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setLoading(false)
    }
  }

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
        toast.success('🤖 Agent started working!')
        fetchWorkflows()
      } else {
        toast.error('Failed to start agent work')
      }
    } catch (error) {
      console.error('Error starting agent work:', error)
      toast.error('Failed to start agent work')
    }
  }

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'code-reviewer':
        return <Brain className="h-4 w-4 text-blue-500" />
      case 'task-executor':
        return <Zap className="h-4 w-4 text-green-500" />
      case 'bug-fixer':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'documentation':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'testing':
        return <CheckCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Bot className="h-4 w-4 text-gray-500" />
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

  const filteredWorkflows = selectedAgent 
    ? workflows.filter(w => w.agentAssignee._id === selectedAgent)
    : workflows

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Sparkles className="h-8 w-8 mr-3 text-purple-600 dark:text-purple-400" />
            Agent Workflow Visualization
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Real-time AI agent task processing and progress tracking
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">Auto-refresh</span>
          </label>
          
          <select
            value={selectedAgent || ''}
            onChange={(e) => setSelectedAgent(e.target.value || null)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="">All Agents</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name} ({agent.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Agents</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {agents.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Bot className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tasks in Progress</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {workflows.filter(w => w.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Completed Today</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {workflows.filter(w => w.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Avg Efficiency</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {agents.length > 0 
                  ? Math.round(agents.reduce((sum, a) => sum + a.performance.efficiencyScore, 0) / agents.length)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <div key={workflow._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  {getAgentTypeIcon(workflow.agentAssignee.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {workflow.agentAssignee.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {workflow.agentAssignee.type.replace('-', ' ')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                  {workflow.priority}
                </span>
              </div>
            </div>

            {/* Task Info */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                {workflow.title}
              </h4>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {workflow.agentWorkflow.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${workflow.agentWorkflow.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* AI Response */}
              {workflow.agentWorkflow.aiResponse && (
                <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg mb-3">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {workflow.agentWorkflow.aiResponse}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span>
                  {workflow.agentWorkflow.lastActivityAt 
                    ? new Date(workflow.agentWorkflow.lastActivityAt).toLocaleTimeString()
                    : 'Never'
                  }
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {workflow.status === 'todo' && (
                  <button
                    onClick={() => startAgentWork(workflow._id, workflow.agentAssignee._id)}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Play className="h-3 w-3" />
                    <span>Start</span>
                  </button>
                )}
                
                {workflow.status === 'in-progress' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Working</span>
                  </div>
                )}
                
                {workflow.status === 'completed' && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Done</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No active workflows
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Assign tasks to agents to see them working here
          </p>
        </div>
      )}
    </div>
  )
}
