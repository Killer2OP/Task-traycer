'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  Target,
  Zap,
  Activity,
  PieChart,
  LineChart,
  Bot,
  Cpu,
  Brain
} from 'lucide-react'

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
  projectStatus: {
    planning: number
    active: number
    'on-hold': number
    completed: number
    cancelled: number
  }
  taskPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  timeTracking: {
    totalEstimatedHours: number
    totalActualHours: number
    efficiency: number
    timeSaved: number
  }
  team: {
    totalMembers: number
    averageTasksPerMember: number
  }
  recentActivity: {
    tasksCreated: number
    tasksUpdated: number
  }
  trends: {
    productivityTrend: number
    completionRate: number
    efficiency: number
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
    agentWorkloads: Array<{
      agentId: string
      agentName: string
      currentTasks: number
      completedTasks: number
      efficiency: number
      status: string
    }>
  }
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No analytics data available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create some projects and tasks to see analytics
        </p>
      </div>
    )
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600 dark:text-green-400'
    if (trend < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track your project performance and team productivity
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.overview.completionRate}%</p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.trends.completionRate)}
                <span className={`text-sm ml-1 ${getTrendColor(analytics.trends.completionRate)}`}>
                  {analytics.trends.completionRate > 0 ? '+' : ''}{analytics.trends.completionRate}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Team Efficiency</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.overview.efficiency}%</p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.trends.efficiency)}
                <span className={`text-sm ml-1 ${getTrendColor(analytics.trends.efficiency)}`}>
                  {analytics.trends.efficiency > 0 ? '+' : ''}{analytics.trends.efficiency}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Time Saved</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.overview.timeSaved}h</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">vs estimates</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">AI Agents</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.agents.totalAgents}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {analytics.agents.activeAgents} active
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Status Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Project Status
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.projectStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status === 'planning' ? 'bg-blue-500' :
                    status === 'active' ? 'bg-green-500' :
                    status === 'on-hold' ? 'bg-yellow-500' :
                    status === 'completed' ? 'bg-emerald-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {status.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Priority Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Task Priority
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.taskPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    priority === 'low' ? 'bg-green-500' :
                    priority === 'medium' ? 'bg-yellow-500' :
                    priority === 'high' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {priority}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" />
          AI Agent Performance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Agent Tasks</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.agents.totalAgentTasks}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {analytics.agents.agentCompletedTasks} completed
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Agent Efficiency</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.agents.averageAgentEfficiency}%</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {analytics.agents.agentCompletionRate}% completion rate
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Cpu className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Agent Hours</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.agents.totalAgentHours}h</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Total work time
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Work</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.agents.agentInProgressTasks}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tasks in progress
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Agent Workload Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Agent Workload Distribution
          </h3>
          <div className="space-y-4">
            {analytics.agents.agentWorkloads.map((agent) => (
              <div key={agent.agentId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{agent.agentName}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                      {agent.status} • {agent.efficiency}% efficiency
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-slate-900 dark:text-white">{agent.currentTasks}</div>
                    <div className="text-slate-500 dark:text-slate-400">Current</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600 dark:text-green-400">{agent.completedTasks}</div>
                    <div className="text-slate-500 dark:text-slate-400">Completed</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Tracking */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Time Tracking
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Estimated</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.timeTracking.totalEstimatedHours}h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Actual</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.timeTracking.totalActualHours}h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Efficiency</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.timeTracking.efficiency}%
              </span>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Team Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Members</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.team.totalMembers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Tasks per Member</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.team.averageTasksPerMember}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Projects</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.overview.totalProjects}
              </span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Milestones
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.overview.totalMilestones}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {analytics.overview.completedMilestones}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Overdue</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {analytics.overview.overdueMilestones}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
