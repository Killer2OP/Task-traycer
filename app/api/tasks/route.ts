import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import Plan from '@/models/Plan';
import Project from '@/models/Project';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/tasks
 * Get all tasks (demo mode - no authentication required)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { planId } = Object.fromEntries(request.nextUrl.searchParams);
    
    let query: any = {};
    if (planId) {
      query.plan = planId;
    }
    
    const tasks = await Task.find(query)
      .populate('assignee', 'name email')
      .populate('agentAssignee', 'name type status')
      .populate('dependencies')
      .sort({ createdAt: -1 });
    
    return createSuccessResponse({ tasks });
    
  } catch (error) {
    console.error('Get tasks error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * POST /api/tasks
 * Create a new task (demo mode - no authentication required)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { title, description, planId, priority, dueDate, assigneeId, dependencies } = await request.json();
    
    if (!title || !planId) {
      return createErrorResponse('Title and plan ID are required');
    }
    
    // Verify plan exists and user has access
    const plan = await Plan.findById(planId).populate('project');
    if (!plan) {
      return createErrorResponse('Plan not found', 404);
    }
    
    const task = new Task({
      title,
      description: description || '',
      plan: planId,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignee: assigneeId || undefined,
      dependencies: dependencies || [],
    });
    
    await task.save();
    
    // Add task to plan
    plan.tasks.push(task._id);
    await plan.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email')
      .populate('agentAssignee', 'name type status')
      .populate('dependencies');
    
    return createSuccessResponse({ task: populatedTask }, 201);
    
  } catch (error) {
    console.error('Create task error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}