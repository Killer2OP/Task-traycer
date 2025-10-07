import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Agent from '@/models/Agent'
import Task from '@/models/Task'
import Project from '@/models/Project'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, taskId, projectId, action } = body

    if (!agentId || !action) {
      return createErrorResponse('Agent ID and action are required', 400)
    }

    await connectDB()

    const agent = await Agent.findOne({ 
      _id: agentId, 
      owner: MOCK_USER_ID 
    })

    if (!agent) {
      return createErrorResponse('Agent not found', 404)
    }

    if (action === 'assign-task' && taskId) {
      // Check if task exists and user has access
      const task = await Task.findById(taskId).populate('plan')
      if (!task) {
        return createErrorResponse('Task not found', 404)
      }

      // Add task to agent's assigned tasks if not already assigned
      if (!agent.assignedTasks.includes(taskId)) {
        agent.assignedTasks.push(taskId)
        await agent.save()
      }

      // Update task assignee and agent workflow
      task.assignee = agentId
      task.agentAssignee = agentId
      task.agentWorkflow.assignedAt = new Date()
      task.agentWorkflow.lastActivityAt = new Date()
      task.agentWorkflow.progressPercentage = 0
      task.agentWorkflow.aiResponse = `🤖 Task assigned to ${agent.name}. Ready to begin work.`
      
      // Add initial progress update
      task.agentWorkflow.autoProgressUpdates.push({
        timestamp: new Date(),
        status: 'assigned',
        note: task.agentWorkflow.aiResponse,
        progressPercentage: 0
      })
      
      await task.save()

      return createSuccessResponse({ 
        message: 'Task assigned to agent successfully',
        agent: agent 
      })
    }

    if (action === 'assign-project' && projectId) {
      // Check if project exists and user has access
      const project = await Project.findOne({ 
        _id: projectId, 
        $or: [
          { owner: MOCK_USER_ID },
          { collaborators: MOCK_USER_ID }
        ]
      })
      
      if (!project) {
        return createErrorResponse('Project not found', 404)
      }

      // Add project to agent's assigned projects if not already assigned
      if (!agent.assignedProjects.includes(projectId)) {
        agent.assignedProjects.push(projectId)
        await agent.save()
      }

      return createSuccessResponse({ 
        message: 'Project assigned to agent successfully',
        agent: agent 
      })
    }

    if (action === 'unassign-task' && taskId) {
      // Remove task from agent's assigned tasks
      agent.assignedTasks = agent.assignedTasks.filter(id => id.toString() !== taskId)
      await agent.save()

      // Remove assignee from task
      const task = await Task.findById(taskId)
      if (task) {
        task.assignee = undefined
        task.agentAssignee = undefined
        task.agentWorkflow.lastActivityAt = new Date()
        task.agentWorkflow.aiResponse = `❌ Task unassigned from agent.`
        
        // Add unassignment update
        task.agentWorkflow.autoProgressUpdates.push({
          timestamp: new Date(),
          status: 'unassigned',
          note: task.agentWorkflow.aiResponse,
          progressPercentage: task.agentWorkflow.progressPercentage
        })
        
        await task.save()
      }

      return createSuccessResponse({ 
        message: 'Task unassigned from agent successfully',
        agent: agent 
      })
    }

    if (action === 'unassign-project' && projectId) {
      // Remove project from agent's assigned projects
      agent.assignedProjects = agent.assignedProjects.filter(id => id.toString() !== projectId)
      await agent.save()

      return createSuccessResponse({ 
        message: 'Project unassigned from agent successfully',
        agent: agent 
      })
    }

    return createErrorResponse('Invalid action', 400)
  } catch (error) {
    console.error('Error managing agent assignments:', error)
    return createErrorResponse('Failed to manage agent assignments', 500)
  }
}
