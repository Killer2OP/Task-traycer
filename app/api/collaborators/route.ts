import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/collaborators
 * Get all collaborators across projects the user has access to (demo mode - no authentication required)
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
    })
    .populate('owner', 'name email')
    .populate('collaborators', 'name email');
    
    // Extract unique collaborators
    const collaboratorsMap = new Map();
    
    projects.forEach(project => {
      // Add project owner
      if (project.owner && project.owner._id.toString() !== MOCK_USER_ID) {
        collaboratorsMap.set(project.owner._id.toString(), {
          ...project.owner.toObject(),
          projects: [...(collaboratorsMap.get(project.owner._id.toString())?.projects || []), {
            _id: project._id,
            name: project.name,
            role: 'owner'
          }]
        });
      }
      
      // Add collaborators
      project.collaborators.forEach((collaborator: any) => {
        if (collaborator._id.toString() !== MOCK_USER_ID) {
          collaboratorsMap.set(collaborator._id.toString(), {
            ...collaborator.toObject(),
            projects: [...(collaboratorsMap.get(collaborator._id.toString())?.projects || []), {
              _id: project._id,
              name: project.name,
              role: 'collaborator'
            }]
          });
        }
      });
    });
    
    const collaborators = Array.from(collaboratorsMap.values());
    
    return createSuccessResponse({ collaborators });
    
  } catch (error) {
    console.error('Get collaborators error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * POST /api/collaborators
 * Add a collaborator to a project (demo mode - no authentication required)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { projectId, email } = await request.json();
    
    if (!projectId || !email) {
      return createErrorResponse('Project ID and email are required');
    }
    
    // Check if user has access to the project (must be owner)
    const project = await Project.findOne({
      _id: projectId,
      owner: MOCK_USER_ID
    });
    
    if (!project) {
      return createErrorResponse('Project not found or insufficient permissions', 404);
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return createErrorResponse('User not found', 404);
    }
    
    // Check if user is already a collaborator
    if (project.collaborators.includes(user._id)) {
      return createErrorResponse('User is already a collaborator', 400);
    }
    
    // Add collaborator
    project.collaborators.push(user._id);
    await project.save();
    
    // Return updated project with populated collaborators
    const updatedProject = await Project.findById(projectId)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');
    
    return createSuccessResponse({ project: updatedProject });
    
  } catch (error) {
    console.error('Add collaborator error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * DELETE /api/collaborators
 * Remove a collaborator from a project (demo mode - no authentication required)
 */
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { projectId, userId } = await request.json();
    
    if (!projectId || !userId) {
      return createErrorResponse('Project ID and user ID are required');
    }
    
    // Check if user has access to the project (must be owner)
    const project = await Project.findOne({
      _id: projectId,
      owner: MOCK_USER_ID
    });
    
    if (!project) {
      return createErrorResponse('Project not found or insufficient permissions', 404);
    }
    
    // Remove collaborator
    project.collaborators = project.collaborators.filter(
      (id: any) => id.toString() !== userId
    );
    await project.save();
    
    // Return updated project with populated collaborators
    const updatedProject = await Project.findById(projectId)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');
    
    return createSuccessResponse({ project: updatedProject });
    
  } catch (error) {
    console.error('Remove collaborator error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
