import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Plan from '@/models/Plan';
import Project from '@/models/Project';
import Task from '@/models/Task';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/plans/[id]
 * Get a specific plan with tasks (demo mode - no authentication required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const plan = await Plan.findById(id)
      .populate('project')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignee', select: 'name email' },
          { path: 'dependencies' }
        ]
      });
    
    if (!plan) {
      return createErrorResponse('Plan not found', 404);
    }
    
    // Check if user has access to the project
    const project = plan.project as any;
    if (project.owner.toString() !== MOCK_USER_ID && 
        !project.collaborators.includes(MOCK_USER_ID)) {
      return createErrorResponse('Access denied', 403);
    }
    
    return createSuccessResponse({ plan });
    
  } catch (error) {
    console.error('Get plan error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * PUT /api/plans/[id]
 * Update a plan (demo mode - no authentication required)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { name, description } = await request.json();
    
    const plan = await Plan.findById(id).populate('project');
    if (!plan) {
      return createErrorResponse('Plan not found', 404);
    }
    
    // Check if user has access to the project
    const project = plan.project as any;
    if (project.owner.toString() !== MOCK_USER_ID && 
        !project.collaborators.includes(MOCK_USER_ID)) {
      return createErrorResponse('Access denied', 403);
    }
    
    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    
    await plan.save();
    
    const populatedPlan = await Plan.findById(plan._id)
      .populate('project')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignee', select: 'name email' },
          { path: 'dependencies' }
        ]
      });
    
    return createSuccessResponse({ plan: populatedPlan });
    
  } catch (error) {
    console.error('Update plan error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * DELETE /api/plans/[id]
 * Delete a plan (demo mode - no authentication required)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const plan = await Plan.findById(id).populate('project');
    if (!plan) {
      return createErrorResponse('Plan not found', 404);
    }
    
    // Check if user has access to the project
    const project = plan.project as any;
    if (project.owner.toString() !== MOCK_USER_ID && 
        !project.collaborators.includes(MOCK_USER_ID)) {
      return createErrorResponse('Access denied', 403);
    }
    
    // Delete all tasks in the plan
    await Task.deleteMany({ plan: id });
    
    await Plan.findByIdAndDelete(id);
    
    return createSuccessResponse({ message: 'Plan deleted successfully' });
    
  } catch (error) {
    console.error('Delete plan error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}