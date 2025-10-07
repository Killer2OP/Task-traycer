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
 * GET /api/tasks/[id]
 * Get a specific task (demo mode - no authentication required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const task = await Task.findById(id)
      .populate('assignee', 'name email')
      .populate('dependencies')
      .populate('plan');
    
    if (!task) {
      return createErrorResponse('Task not found', 404);
    }
    
    return createSuccessResponse({ task });
    
  } catch (error) {
    console.error('Get task error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * PUT /api/tasks/[id]
 * Update a task (demo mode - no authentication required)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { title, description, status, priority, dueDate, assigneeId, dependencies } = await request.json();
    
    const task = await Task.findById(id);
    if (!task) {
      return createErrorResponse('Task not found', 404);
    }
    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (assigneeId !== undefined) task.assignee = assigneeId;
    if (dependencies) task.dependencies = dependencies;
    
    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email')
      .populate('dependencies');
    
    return createSuccessResponse({ task: populatedTask });
    
  } catch (error) {
    console.error('Update task error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task (demo mode - no authentication required)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const task = await Task.findById(id);
    if (!task) {
      return createErrorResponse('Task not found', 404);
    }
    
    // Remove task from plan
    await Plan.updateMany(
      { tasks: id },
      { $pull: { tasks: id } }
    );
    
    // Remove task from dependencies of other tasks
    await Task.updateMany(
      { dependencies: id },
      { $pull: { dependencies: id } }
    );
    
    await Task.findByIdAndDelete(id);
    
    return createSuccessResponse({ message: 'Task deleted successfully' });
    
  } catch (error) {
    console.error('Delete task error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}