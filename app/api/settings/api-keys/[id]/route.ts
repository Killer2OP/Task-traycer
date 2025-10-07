import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import UserSettings from '@/models/UserSettings'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011'

// PUT /api/settings/api-keys/[id] - Update API key
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { isActive } = body
    const { id } = await params

    await connectDB()
    
    const settings = await UserSettings.findOne({ userId: MOCK_USER_ID })
    
    if (!settings) {
      return createErrorResponse('Settings not found', 404)
    }

    const apiKey = settings.apiKeys.id(id)
    
    if (!apiKey) {
      return createErrorResponse('API key not found', 404)
    }

    apiKey.isActive = isActive
    apiKey.updatedAt = new Date()
    
    await settings.save()

    return createSuccessResponse({ 
      message: 'API key updated successfully',
      apiKey: {
        id: apiKey._id,
        provider: apiKey.provider,
        model: apiKey.model,
        isActive: apiKey.isActive,
        keyPreview: apiKey.key.substring(0, 8) + '...' + apiKey.key.substring(apiKey.key.length - 4)
      }
    })
  } catch (error) {
    console.error('Error updating API key:', error)
    return createErrorResponse('Failed to update API key', 500)
  }
}

// DELETE /api/settings/api-keys/[id] - Delete API key
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    
    const settings = await UserSettings.findOne({ userId: MOCK_USER_ID })
    
    if (!settings) {
      return createErrorResponse('Settings not found', 404)
    }

    const apiKey = settings.apiKeys.id(id)
    
    if (!apiKey) {
      return createErrorResponse('API key not found', 404)
    }

    apiKey.deleteOne()
    await settings.save()

    return createSuccessResponse({ message: 'API key deleted successfully' })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return createErrorResponse('Failed to delete API key', 500)
  }
}
