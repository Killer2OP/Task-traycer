import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Milestone from '@/models/Milestone';
import Project from '@/models/Project';
import Task from '@/models/Task';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/milestones/[id]
 * Get a specific milestone
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const milestone = await Milestone.findById(id)
      .populate('project')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignee', select: 'name email' },
          { path: 'dependencies' }
        ]
      });
    
    if (!milestone) {
      return createErrorResponse('Milestone not found', 404);
    }
    
    // Check if user has access to the project
    const project = milestone.project as any;
    if (project.owner.toString() !== MOCK_USER_ID && 
        !project.collaborators.includes(MOCK_USER_ID)) {
      return createErrorResponse('Access denied', 403);
    }
    
    return createSuccessResponse({ milestone });
    
  } catch (error) {
    console.error('Get milestone error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * PUT /api/milestones/[id]
 * Update a milestone
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { name, description, dueDate, status, tasks } = await request.json();
    
    const milestone = await Milestone.findById(id).populate('project');
    if (!milestone) {
      return createErrorResponse('Milestone not found', 404);
    }
    
    // Check if user has access to the project
    const project = milestone.project as any;
    if (project.owner.toString() !== MOCK_USER_ID && 
        !project.collaborators.includes(MOCK_USER_ID)) {
      return createErrorResponse('Access denied', 403);
    }
    
    if (name) milestone.name = name;
    if (description !== undefined) milestone.description = description;
    if (dueDate) milestone.dueDate = new Date(dueDate);
    if (status) milestone.status = status;
    if (tasks) milestone.tasks = tasks;
    
    // Update completed date if status is completed
    if (status === 'completed' && milestone.status !== 'completed') {
      milestone.completedDate = new Date();
    }
    
    await milestone.save();
    
    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate('project')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignee', select: 'name email' },
          { path: 'dependencies' }
        ]
      });
    
    return createSuccessResponse({ milestone: populatedMilestone });
    
  } catch (error) {
    console.error('Update milestone error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * DELETE /api/milestones/[id]
 * Delete a milestone
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const milestone = await Milestone.findById(id).populate('project');
    if (!milestone) {
      return createErrorResponse('Milestone not found', 404);
    }
    
    // Check if user has access to the project
    const project = milestone.project as any;
    if (project.owner.toString() !== MOCK_USER_ID && 
        !project.collaborators.includes(MOCK_USER_ID)) {
      return createErrorResponse('Access denied', 403);
    }
    
    // Remove milestone from project
    await Project.findByIdAndUpdate(
      milestone.project,
      { $pull: { milestones: id } }
    );
    
    // Remove milestone reference from tasks
    await Task.updateMany(
      { milestone: id },
      { $unset: { milestone: 1 } }
    );
    
    await Milestone.findByIdAndDelete(id);
    
    return createSuccessResponse({ message: 'Milestone deleted successfully' });
    
  } catch (error) {
    console.error('Delete milestone error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
