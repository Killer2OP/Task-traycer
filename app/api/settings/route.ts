import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import UserSettings from '@/models/UserSettings'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011'

// GET /api/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    let settings = await UserSettings.findOne({ userId: MOCK_USER_ID })
    
    // Create default settings if none exist
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
      await settings.save()
    }

    return createSuccessResponse({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return createErrorResponse('Failed to fetch settings', 500)
  }
}

// POST /api/settings - Update user settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { preferences } = body

    await connectDB()
    
    const settings = await UserSettings.findOneAndUpdate(
      { userId: MOCK_USER_ID },
      { 
        $set: { 
          preferences: {
            ...preferences,
            updatedAt: new Date()
          }
        }
      },
      { upsert: true, new: true }
    )

    return createSuccessResponse({ settings })
  } catch (error) {
    console.error('Error updating settings:', error)
    return createErrorResponse('Failed to update settings', 500)
  }
}
