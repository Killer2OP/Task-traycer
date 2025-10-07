import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import UserSettings from '@/models/UserSettings'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011'

// GET /api/settings/api-keys - Get user API keys
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const settings = await UserSettings.findOne({ userId: MOCK_USER_ID })
    
    if (!settings) {
      return createSuccessResponse({ apiKeys: [] })
    }

    // Return API keys without exposing the actual key values for security
    const apiKeys = settings.apiKeys.map(key => ({
      id: key._id,
      provider: key.provider,
      model: key.model,
      isActive: key.isActive,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      keyPreview: key.key.substring(0, 8) + '...' + key.key.substring(key.key.length - 4)
    }))

    return createSuccessResponse({ apiKeys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return createErrorResponse('Failed to fetch API keys', 500)
  }
}

// POST /api/settings/api-keys - Add new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, model, key } = body

    if (!provider || !model || !key) {
      return createErrorResponse('Provider, model, and key are required', 400)
    }

    await connectDB()
    
    let settings = await UserSettings.findOne({ userId: MOCK_USER_ID })
    
    if (!settings) {
      settings = new UserSettings({
        userId: MOCK_USER_ID,
        apiKeys: [],
        preferences: {
          defaultModel: 'gpt-3.5-turbo',
          theme: 'system',
          notifications: true
        }
      })
    }

    // Check if API key already exists for this provider/model combination
    const existingKey = settings.apiKeys.find(
      apiKey => apiKey.provider === provider && apiKey.model === model
    )

    if (existingKey) {
      // Update existing key
      existingKey.key = key
      existingKey.isActive = true
      existingKey.updatedAt = new Date()
    } else {
      // Add new key
      settings.apiKeys.push({
        provider,
        model,
        key,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await settings.save()

    return createSuccessResponse({ 
      message: 'API key added successfully',
      apiKey: {
        id: existingKey?._id || settings.apiKeys[settings.apiKeys.length - 1]._id,
        provider,
        model,
        isActive: true,
        keyPreview: key.substring(0, 8) + '...' + key.substring(key.length - 4)
      }
    })
  } catch (error) {
    console.error('Error adding API key:', error)
    return createErrorResponse('Failed to add API key', 500)
  }
}
