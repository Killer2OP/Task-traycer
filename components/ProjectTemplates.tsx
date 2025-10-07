'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Calendar, 
  Clock,
  CheckCircle,
  ArrowRight,
  Download,
  Eye,
  Tag
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ProjectTemplate {
  _id: string
  name: string
  description: string
  category: string
  plans: Array<{
    name: string
    description: string
    tasks: Array<{
      title: string
      description: string
      priority: string
      estimatedHours?: number
      tags: string[]
    }>
  }>
  milestones: Array<{
    name: string
    description: string
    dueDateOffset: number
  }>
  tags: string[]
  isPublic: boolean
  createdBy: {
    _id: string
    name: string
    email: string
  }
  usageCount: number
  createdAt: string
}

export default function ProjectTemplates() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)

  const categories = [
    'web-app',
    'mobile-app', 
    'api',
    'data-science',
    'devops',
    'design',
    'marketing',
    'other'
  ]

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to fetch templates')
    } finally {
      setLoading(false)
    }
  }

  const createProjectFromTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: `${templates.find(t => t._id === templateId)?.name} Project`,
          projectDescription: `Project created from ${templates.find(t => t._id === templateId)?.name} template`,
          startDate: new Date().toISOString().split('T')[0],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Project created successfully!')
        // Redirect to the new project or refresh the dashboard
        window.location.href = '/dashboard'
      } else {
        toast.error('Failed to create project from template')
      }
    } catch (error) {
      console.error('Error using template:', error)
      toast.error('Failed to create project from template')
    }
  }

  const handleUseTemplate = (templateId: string) => {
    createProjectFromTemplate(templateId)
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-app':
        return '🌐'
      case 'mobile-app':
        return '📱'
      case 'api':
        return '🔌'
      case 'data-science':
        return '📊'
      case 'devops':
        return '⚙️'
      case 'design':
        return '🎨'
      case 'marketing':
        return '📢'
      default:
        return '📁'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'web-app':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'mobile-app':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'api':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'data-science':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'devops':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'design':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
      case 'marketing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400'
    }
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Project Templates</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Start your projects with pre-built templates
          </p>
        </div>
        <button
          onClick={() => setShowCreateTemplate(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template._id}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getCategoryIcon(template.category)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {template.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                <Star className="h-4 w-4" />
                <span className="text-sm">{template.usageCount}</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
              {template.description || 'No description provided'}
            </p>

            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{template.plans.length} plans</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>{template.plans.reduce((sum, plan) => sum + plan.tasks.length, 0)} tasks</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{template.milestones.length} milestones</span>
              </div>
            </div>

            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4" />
                <span>{template.createdBy.name}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleUseTemplate(template._id)}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <span>Use</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Try adjusting your search or create a new template
          </p>
          <button
            onClick={() => setShowCreateTemplate(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Create Template</span>
          </button>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedTemplate.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {selectedTemplate.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Plans */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Plans ({selectedTemplate.plans.length})
                </h3>
                <div className="space-y-4">
                  {selectedTemplate.plans.map((plan, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        {plan.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {plan.description}
                      </p>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {plan.tasks.length} tasks
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Milestones ({selectedTemplate.milestones.length})
                </h3>
                <div className="space-y-4">
                  {selectedTemplate.milestones.map((milestone, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        {milestone.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {milestone.description}
                      </p>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Due: Day {milestone.dueDateOffset}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUseTemplate(selectedTemplate._id)
                  setSelectedTemplate(null)
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
