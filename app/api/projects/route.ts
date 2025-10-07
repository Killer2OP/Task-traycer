import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/projects
 * Get all projects (demo mode - no authentication required)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const projects = await Project.find({
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    }).populate('owner', 'name email').populate('collaborators', 'name email');
    
    return createSuccessResponse({ projects });
    
  } catch (error) {
    console.error('Get projects error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * POST /api/projects
 * Create a new project (demo mode - no authentication required)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, description, priority, startDate, endDate, budget, tags } = await request.json();
    
    if (!name) {
      return createErrorResponse('Project name is required');
    }
    
    const project = new Project({
      name,
      description: description || '',
      owner: MOCK_USER_ID,
      collaborators: [],
      status: 'planning',
      priority: priority || 'medium',
      tags: tags || [],
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      budget: budget ? parseFloat(budget) : undefined,
      progress: 0,
      milestones: [],
    });
    
    await project.save();
    
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');
    
    return createSuccessResponse({ project: populatedProject }, 201);
    
  } catch (error) {
    console.error('Create project error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
