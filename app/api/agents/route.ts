import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Agent from '@/models/Agent'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const agents = await Agent.find({ owner: MOCK_USER_ID })
      .populate('assignedProjects', 'name status')
      .populate('assignedTasks', 'title status priority')
      .sort({ createdAt: -1 })

    return createSuccessResponse({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return createErrorResponse('Failed to fetch agents', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      type, 
      capabilities, 
      configuration 
    } = body

    if (!name || !type) {
      return createErrorResponse('Name and type are required', 400)
    }

    await connectDB()

    const agent = new Agent({
      name,
      description: description || '',
      type,
      capabilities: capabilities || [],
      owner: MOCK_USER_ID,
      assignedProjects: [],
      assignedTasks: [],
      configuration: {
        maxConcurrentTasks: configuration?.maxConcurrentTasks || 3,
        workingHours: {
          start: configuration?.workingHours?.start || '09:00',
          end: configuration?.workingHours?.end || '17:00',
        },
        autoAcceptTasks: configuration?.autoAcceptTasks || false,
        priorityThreshold: configuration?.priorityThreshold || 'medium',
        skills: configuration?.skills || [],
        aiModel: configuration?.aiModel || 'gpt-4',
        customInstructions: configuration?.customInstructions || '',
      },
      performance: {
        tasksCompleted: 0,
        averageCompletionTime: 0,
        successRate: 100,
        lastActive: new Date(),
      },
    })

    await agent.save()

    return createSuccessResponse({ agent }, 201)
  } catch (error) {
    console.error('Error creating agent:', error)
    return createErrorResponse('Failed to create agent', 500)
  }
}
