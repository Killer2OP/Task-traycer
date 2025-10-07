'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff, Key, Settings, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ApiKey {
  id: string
  provider: string
  model: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  keyPreview: string
}

interface UserSettings {
  apiKeys: ApiKey[]
  preferences: {
    defaultModel: string
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
  }
}

const AI_MODELS = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-3.5-turbo-16k', label: 'GPT-3.5 Turbo 16K' }
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'claude-2', label: 'Claude 2' }
  ],
  google: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' },
    { value: 'bard', label: 'Bard' }
  ],
  cohere: [
    { value: 'command', label: 'Command' },
    { value: 'command-light', label: 'Command Light' },
    { value: 'command-nightly', label: 'Command Nightly' }
  ],
  huggingface: [
    { value: 'llama-2-70b', label: 'Llama 2 70B' },
    { value: 'codellama-34b', label: 'Code Llama 34B' },
    { value: 'mistral-7b', label: 'Mistral 7B' }
  ],
  replicate: [
    { value: 'llama-2-70b', label: 'Llama 2 70B' },
    { value: 'codellama-34b', label: 'Code Llama 34B' },
    { value: 'mistral-7b', label: 'Mistral 7B' }
  ]
}

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', color: 'bg-green-500' },
  { value: 'anthropic', label: 'Anthropic', color: 'bg-orange-500' },
  { value: 'google', label: 'Google', color: 'bg-blue-500' },
  { value: 'cohere', label: 'Cohere', color: 'bg-purple-500' },
  { value: 'huggingface', label: 'Hugging Face', color: 'bg-yellow-500' },
  { value: 'replicate', label: 'Replicate', color: 'bg-red-500' }
]

export default function SettingsTab() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newApiKey, setNewApiKey] = useState({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    key: ''
  })
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        toast.error('Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const addApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newApiKey.key.trim()) {
      toast.error('API key is required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApiKey),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('API key added successfully')
        setNewApiKey({ provider: 'openai', model: 'gpt-3.5-turbo', key: '' })
        setShowAddForm(false)
        fetchSettings() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to add API key')
      }
    } catch (error) {
      console.error('Error adding API key:', error)
      toast.error('Failed to add API key')
    } finally {
      setSaving(false)
    }
  }

  const toggleApiKey = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/settings/api-keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        toast.success(`API key ${isActive ? 'activated' : 'deactivated'}`)
        fetchSettings() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update API key')
      }
    } catch (error) {
      console.error('Error updating API key:', error)
      toast.error('Failed to update API key')
    }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) {
      return
    }

    try {
      const response = await fetch(`/api/settings/api-keys/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('API key deleted successfully')
        fetchSettings() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete API key')
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast.error('Failed to delete API key')
    }
  }

  const getProviderInfo = (provider: string) => {
    return PROVIDERS.find(p => p.value === provider) || { label: provider, color: 'bg-gray-500' }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your AI model API keys and preferences
            </p>
          </div>
          <button
            onClick={fetchSettings}
            className="p-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            title="Refresh settings"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            AI Model API Keys
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add API Key</span>
          </button>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {settings?.apiKeys && settings.apiKeys.length > 0 ? (
            settings.apiKeys.map((apiKey) => {
              const providerInfo = getProviderInfo(apiKey.provider)
              return (
                <div
                  key={apiKey.id}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 ${providerInfo.color} rounded-full`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {providerInfo.label} - {apiKey.model}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                          {apiKey.keyPreview}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          apiKey.isActive 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleApiKey(apiKey.id, !apiKey.isActive)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            apiKey.isActive 
                              ? 'bg-green-500' 
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            apiKey.isActive ? 'translate-x-6' : 'translate-x-0.5'
                          }`}></div>
                        </button>
                      </div>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete API key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Key className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No API keys configured
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Add API keys for different AI models to enable AI-powered features
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Add API Key</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add API Key Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Add New API Key
            </h2>
            
            <form onSubmit={addApiKey}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Provider *
                  </label>
                  <select
                    value={newApiKey.provider}
                    onChange={(e) => {
                      const provider = e.target.value
                      const models = AI_MODELS[provider as keyof typeof AI_MODELS] || []
                      setNewApiKey({ 
                        ...newApiKey, 
                        provider, 
                        model: models[0]?.value || '' 
                      })
                    }}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    required
                  >
                    {PROVIDERS.map((provider) => (
                      <option key={provider.value} value={provider.value}>
                        {provider.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Model *
                  </label>
                  <select
                    value={newApiKey.model}
                    onChange={(e) => setNewApiKey({ ...newApiKey, model: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    required
                  >
                    {AI_MODELS[newApiKey.provider as keyof typeof AI_MODELS]?.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  API Key *
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={newApiKey.key}
                    onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="Enter your API key"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Your API key is encrypted and stored securely. It will not be visible after saving.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewApiKey({ provider: 'openai', model: 'gpt-3.5-turbo', key: '' })
                    setShowKey(false)
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save API Key</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
