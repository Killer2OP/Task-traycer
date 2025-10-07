import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Plan from '@/models/Plan';
import Project from '@/models/Project';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/plans
 * Get all plans for projects the user has access to (demo mode - no authentication required)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Find all projects the user has access to
    const projects = await Project.find({
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    }).select('_id');
    
    const projectIds = projects.map(p => p._id);
    
    // Get all plans for these projects
    const plans = await Plan.find({ project: { $in: projectIds } })
      .populate('project', 'name description')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignee', select: 'name email' },
          { path: 'dependencies' }
        ]
      })
      .sort({ createdAt: -1 });
    
    return createSuccessResponse({ plans });
    
  } catch (error) {
    console.error('Get plans error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * POST /api/plans
 * Create a new plan (demo mode - no authentication required)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, description, projectId } = await request.json();
    
    if (!name) {
      return createErrorResponse('Plan name is required');
    }
    
    if (!projectId) {
      return createErrorResponse('Project ID is required');
    }
    
    // Check if user has access to the project
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    });
    
    if (!project) {
      return createErrorResponse('Project not found or insufficient permissions', 404);
    }
    
    const plan = new Plan({
      name,
      description: description || '',
      project: projectId,
      tasks: [],
    });
    
    await plan.save();
    
    const populatedPlan = await Plan.findById(plan._id)
      .populate('project', 'name description')
      .populate('tasks');
    
    return createSuccessResponse({ plan: populatedPlan }, 201);
    
  } catch (error) {
    console.error('Create plan error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
