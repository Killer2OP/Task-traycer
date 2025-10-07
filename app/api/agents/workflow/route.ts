import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Agent from '@/models/Agent'
import Task from '@/models/Task'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011'

// Simulate AI agent responses based on task type and progress
const generateAIResponse = (task: any, progress: number, status: string) => {
  const responses = {
    'code-reviewer': [
      `🔍 Code review in progress... Analyzed ${progress}% of the codebase. Found ${Math.floor(Math.random() * 5)} potential improvements.`,
      `📝 Reviewing pull request #${Math.floor(Math.random() * 1000)}. Identified ${Math.floor(Math.random() * 3)} security concerns.`,
      `✅ Code review completed! All critical issues addressed. Ready for merge.`
    ],
    'task-executor': [
      `⚡ Executing task: ${task.title}. Progress: ${progress}% complete.`,
      `🔄 Working on implementation... ${Math.floor(Math.random() * 10)} files modified.`,
      `🎯 Task execution completed successfully! All requirements met.`
    ],
    'bug-fixer': [
      `🐛 Investigating bug report... Located issue in ${Math.floor(Math.random() * 5)} files.`,
      `🔧 Applying fix... Testing ${Math.floor(Math.random() * 10)} scenarios.`,
      `✅ Bug fixed and verified! All tests passing.`
    ],
    'documentation': [
      `📚 Writing documentation... ${progress}% complete.`,
      `📖 Updating API docs and user guides...`,
      `📋 Documentation completed! All sections updated.`
    ],
    'testing': [
      `🧪 Running test suite... ${Math.floor(Math.random() * 50)} tests executed.`,
      `🔍 Analyzing test results... Coverage: ${Math.floor(Math.random() * 20) + 80}%`,
      `✅ All tests passing! Quality assurance complete.`
    ],
    'custom': [
      `🤖 Processing custom task: ${task.title}...`,
      `⚙️ Executing specialized workflow...`,
      `✨ Custom task completed with enhanced results!`
    ]
  }

  const agentType = task.agentAssignee?.type || 'custom'
  const typeResponses = responses[agentType as keyof typeof responses] || responses.custom
  
  if (progress < 30) return typeResponses[0]
  if (progress < 80) return typeResponses[1]
  return typeResponses[2]
}

// Simulate agent working on task
const simulateAgentWork = async (taskId: string, agentId: string) => {
  try {
    await connectDB()
    
    const task = await Task.findById(taskId).populate('agentAssignee')
    const agent = await Agent.findById(agentId)
    
    if (!task || !agent) {
      throw new Error('Task or agent not found')
    }

    // Update agent status to busy
    agent.status = 'busy'
    agent.performance.lastActive = new Date()
    agent.performance.currentWorkload = agent.assignedTasks.length
    
    // Simulate work progress
    const currentProgress = task.agentWorkflow.progressPercentage || 0
    const increment = Math.floor(Math.random() * 20) + 10 // 10-30% progress
    const newProgress = Math.min(currentProgress + increment, 100)
    
    // Update task workflow
    if (!task.agentWorkflow.startedAt) {
      task.agentWorkflow.startedAt = new Date()
    }
    
    task.agentWorkflow.progressPercentage = newProgress
    task.agentWorkflow.lastActivityAt = new Date()
    task.agentWorkflow.aiResponse = generateAIResponse(task, newProgress, task.status)
    
    // Add progress update
    task.agentWorkflow.autoProgressUpdates.push({
      timestamp: new Date(),
      status: newProgress === 100 ? 'completed' : 'in-progress',
      note: task.agentWorkflow.aiResponse,
      progressPercentage: newProgress
    })
    
    // Update task status based on progress
    if (newProgress === 100) {
      task.status = 'completed'
      task.agentWorkflow.completedAt = new Date()
      agent.status = 'idle'
      
      // Update agent performance
      agent.performance.tasksCompleted += 1
      agent.performance.totalHoursWorked += (task.estimatedHours || 1)
      
      // Calculate completion time
      const startTime = task.agentWorkflow.startedAt || task.createdAt
      const completionTime = (Date.now() - startTime.getTime()) / (1000 * 60 * 60) // hours
      agent.performance.averageCompletionTime = 
        (agent.performance.averageCompletionTime * (agent.performance.tasksCompleted - 1) + completionTime) / 
        agent.performance.tasksCompleted
    } else if (newProgress > 0 && task.status === 'todo') {
      task.status = 'in-progress'
    }
    
    await task.save()
    await agent.save()
    
    return { task, agent, progress: newProgress }
  } catch (error) {
    console.error('Error simulating agent work:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, taskId, agentId, progress, note } = body

    await connectDB()

    if (action === 'start-work') {
      if (!taskId || !agentId) {
        return createErrorResponse('Task ID and Agent ID are required', 400)
      }

      const result = await simulateAgentWork(taskId, agentId)
      
      return createSuccessResponse({
        message: 'Agent started working on task',
        task: result.task,
        agent: result.agent,
        progress: result.progress
      })
    }

    if (action === 'update-progress') {
      if (!taskId || !agentId) {
        return createErrorResponse('Task ID and Agent ID are required', 400)
      }

      const task = await Task.findById(taskId)
      const agent = await Agent.findById(agentId)

      if (!task || !agent) {
        return createErrorResponse('Task or agent not found', 404)
      }

      // Update progress manually
      const newProgress = Math.min(Math.max(progress || 0, 0), 100)
      task.agentWorkflow.progressPercentage = newProgress
      task.agentWorkflow.lastActivityAt = new Date()
      
      if (note) {
        task.agentWorkflow.agentNotes = note
      }

      // Add progress update
      task.agentWorkflow.autoProgressUpdates.push({
        timestamp: new Date(),
        status: newProgress === 100 ? 'completed' : 'in-progress',
        note: note || 'Manual progress update',
        progressPercentage: newProgress
      })

      // Update task status
      if (newProgress === 100) {
        task.status = 'completed'
        task.agentWorkflow.completedAt = new Date()
      } else if (newProgress > 0 && task.status === 'todo') {
        task.status = 'in-progress'
      }

      await task.save()

      return createSuccessResponse({
        message: 'Task progress updated',
        task: task,
        progress: newProgress
      })
    }

    if (action === 'complete-task') {
      if (!taskId || !agentId) {
        return createErrorResponse('Task ID and Agent ID are required', 400)
      }

      const task = await Task.findById(taskId)
      const agent = await Agent.findById(agentId)

      if (!task || !agent) {
        return createErrorResponse('Task or agent not found', 404)
      }

      // Complete the task
      task.status = 'completed'
      task.agentWorkflow.progressPercentage = 100
      task.agentWorkflow.completedAt = new Date()
      task.agentWorkflow.lastActivityAt = new Date()
      task.agentWorkflow.aiResponse = generateAIResponse(task, 100, 'completed')

      // Add final progress update
      task.agentWorkflow.autoProgressUpdates.push({
        timestamp: new Date(),
        status: 'completed',
        note: task.agentWorkflow.aiResponse,
        progressPercentage: 100
      })

      // Update agent performance
      agent.status = 'idle'
      agent.performance.tasksCompleted += 1
      agent.performance.totalHoursWorked += (task.estimatedHours || 1)
      agent.performance.lastActive = new Date()

      await task.save()
      await agent.save()

      return createSuccessResponse({
        message: 'Task completed successfully',
        task: task,
        agent: agent
      })
    }

    if (action === 'pause-task') {
      if (!taskId || !agentId) {
        return createErrorResponse('Task ID and Agent ID are required', 400)
      }

      const task = await Task.findById(taskId)
      const agent = await Agent.findById(agentId)

      if (!task || !agent) {
        return createErrorResponse('Task or agent not found', 404)
      }

      // Pause the task
      task.status = 'blocked'
      task.agentWorkflow.lastActivityAt = new Date()
      task.agentWorkflow.aiResponse = `⏸️ Task paused. Reason: ${note || 'Manual pause'}`

      // Add pause update
      task.agentWorkflow.autoProgressUpdates.push({
        timestamp: new Date(),
        status: 'blocked',
        note: task.agentWorkflow.aiResponse,
        progressPercentage: task.agentWorkflow.progressPercentage
      })

      agent.status = 'idle'
      await task.save()
      await agent.save()

      return createSuccessResponse({
        message: 'Task paused',
        task: task,
        agent: agent
      })
    }

    return createErrorResponse('Invalid action', 400)
  } catch (error) {
    console.error('Error managing agent workflow:', error)
    return createErrorResponse('Failed to manage agent workflow', 500)
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { agentId } = Object.fromEntries(request.nextUrl.searchParams)
    
    if (agentId) {
      // Get workflow for specific agent
      const agent = await Agent.findById(agentId).populate('assignedTasks')
      const tasks = await Task.find({ agentAssignee: agentId })
        .populate('plan')
        .sort({ 'agentWorkflow.lastActivityAt': -1 })
      
      return createSuccessResponse({
        agent: agent,
        tasks: tasks
      })
    } else {
      // Get all active workflows
      const activeTasks = await Task.find({
        agentAssignee: { $exists: true },
        status: { $in: ['in-progress', 'todo'] }
      })
        .populate('agentAssignee')
        .populate('plan')
        .sort({ 'agentWorkflow.lastActivityAt': -1 })
      
      return createSuccessResponse({
        activeWorkflows: activeTasks
      })
    }
  } catch (error) {
    console.error('Error fetching agent workflow:', error)
    return createErrorResponse('Failed to fetch agent workflow', 500)
  }
}
