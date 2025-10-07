import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/projects/[id]
 * Get a specific project (demo mode - no authentication required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const project = await Project.findOne({
      _id: id,
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    }).populate('owner', 'name email').populate('collaborators', 'name email');
    
    if (!project) {
      return createErrorResponse('Project not found', 404);
    }
    
    return createSuccessResponse({ project });
    
  } catch (error) {
    console.error('Get project error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * PUT /api/projects/[id]
 * Update a project (demo mode - no authentication required)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { name, description } = await request.json();
    
    const project = await Project.findOne({
      _id: id,
      owner: MOCK_USER_ID // Only owner can update
    });
    
    if (!project) {
      return createErrorResponse('Project not found or insufficient permissions', 404);
    }
    
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    
    await project.save();
    
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');
    
    return createSuccessResponse({ project: populatedProject });
    
  } catch (error) {
    console.error('Update project error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project (demo mode - no authentication required)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const project = await Project.findOne({
      _id: id,
      owner: MOCK_USER_ID // Only owner can delete
    });
    
    if (!project) {
      return createErrorResponse('Project not found or insufficient permissions', 404);
    }
    
    await Project.findByIdAndDelete(id);
    
    return createSuccessResponse({ message: 'Project deleted successfully' });
    
  } catch (error) {
    console.error('Delete project error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
