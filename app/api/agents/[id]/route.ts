import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Agent from '@/models/Agent'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params;
    
    const agent = await Agent.findOne({ 
      _id: id, 
      owner: MOCK_USER_ID 
    })
      .populate('assignedProjects', 'name status')
      .populate('assignedTasks', 'title status priority')

    if (!agent) {
      return createErrorResponse('Agent not found', 404)
    }

    return createSuccessResponse({ agent })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return createErrorResponse('Failed to fetch agent', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { 
      name, 
      description, 
      type, 
      capabilities, 
      configuration,
      status 
    } = body

    await connectDB()

    const agent = await Agent.findOne({ 
      _id: id, 
      owner: MOCK_USER_ID 
    })

    if (!agent) {
      return createErrorResponse('Agent not found', 404)
    }

    // Update fields
    if (name !== undefined) agent.name = name
    if (description !== undefined) agent.description = description
    if (type !== undefined) agent.type = type
    if (capabilities !== undefined) agent.capabilities = capabilities
    if (status !== undefined) agent.status = status
    if (configuration !== undefined) {
      agent.configuration = { ...agent.configuration, ...configuration }
    }

    await agent.save()

    return createSuccessResponse({ agent })
  } catch (error) {
    console.error('Error updating agent:', error)
    return createErrorResponse('Failed to update agent', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB()

    const agent = await Agent.findOne({ 
      _id: id, 
      owner: MOCK_USER_ID 
    })

    if (!agent) {
      return createErrorResponse('Agent not found', 404)
    }

    await Agent.findByIdAndDelete(id)

    return createSuccessResponse({ message: 'Agent deleted successfully' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return createErrorResponse('Failed to delete agent', 500)
  }
}
