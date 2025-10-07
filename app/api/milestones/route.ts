import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Milestone from '@/models/Milestone';
import Project from '@/models/Project';
import Task from '@/models/Task';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/milestones
 * Get all milestones for a project
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { projectId } = Object.fromEntries(request.nextUrl.searchParams);
    
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
    
    const milestones = await Milestone.find({ project: projectId })
      .populate('tasks')
      .sort({ dueDate: 1 });
    
    return createSuccessResponse({ milestones });
    
  } catch (error) {
    console.error('Get milestones error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * POST /api/milestones
 * Create a new milestone
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, description, projectId, dueDate, tasks } = await request.json();
    
    if (!name || !projectId || !dueDate) {
      return createErrorResponse('Name, project ID, and due date are required');
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
    
    const milestone = new Milestone({
      name,
      description: description || '',
      project: projectId,
      dueDate: new Date(dueDate),
      tasks: tasks || [],
    });
    
    await milestone.save();
    
    // Add milestone to project
    project.milestones.push(milestone._id);
    await project.save();
    
    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate('tasks');
    
    return createSuccessResponse({ milestone: populatedMilestone }, 201);
    
  } catch (error) {
    console.error('Create milestone error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
