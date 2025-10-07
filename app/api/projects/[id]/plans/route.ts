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
 * GET /api/projects/[id]/plans
 * Get all plans for a project (demo mode - no authentication required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Check if user has access to the project
    const project = await Project.findOne({
      _id: id,
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    });
    
    if (!project) {
      return createErrorResponse('Project not found or insufficient permissions', 404);
    }
    
    const plans = await Plan.find({ project: id })
      .populate('tasks')
      .sort({ createdAt: -1 });
    
    return createSuccessResponse({ plans });
    
  } catch (error) {
    console.error('Get plans error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * POST /api/projects/[id]/plans
 * Create a new plan (demo mode - no authentication required)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Check if user has access to the project
    const project = await Project.findOne({
      _id: id,
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    });
    
    if (!project) {
      return createErrorResponse('Project not found or insufficient permissions', 404);
    }
    
    const { name, description } = await request.json();
    
    if (!name) {
      return createErrorResponse('Plan name is required');
    }
    
    const plan = new Plan({
      name,
      description: description || '',
      project: id,
      tasks: [],
    });
    
    await plan.save();
    
    const populatedPlan = await Plan.findById(plan._id).populate('tasks');
    
    return createSuccessResponse({ plan: populatedPlan }, 201);
    
  } catch (error) {
    console.error('Create plan error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
