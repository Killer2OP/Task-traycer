import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectTemplate from '@/models/ProjectTemplate';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/templates/[id]
 * Get a specific project template
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const template = await ProjectTemplate.findById(id)
      .populate('createdBy', 'name email');
    
    if (!template) {
      return createErrorResponse('Template not found', 404);
    }
    
    // Check if template is public or user is the creator
    if (!template.isPublic && template.createdBy.toString() !== MOCK_USER_ID) {
      return createErrorResponse('Access denied', 403);
    }
    
    return createSuccessResponse({ template });
    
  } catch (error) {
    console.error('Get template error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * PUT /api/templates/[id]
 * Update a project template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { name, description, category, plans, milestones, tags, isPublic } = await request.json();
    
    const template = await ProjectTemplate.findById(id);
    if (!template) {
      return createErrorResponse('Template not found', 404);
    }
    
    // Check if user is the creator
    if (template.createdBy.toString() !== MOCK_USER_ID) {
      return createErrorResponse('Access denied', 403);
    }
    
    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    if (category) template.category = category;
    if (plans) template.plans = plans;
    if (milestones) template.milestones = milestones;
    if (tags) template.tags = tags;
    if (isPublic !== undefined) template.isPublic = isPublic;
    
    await template.save();
    
    const populatedTemplate = await ProjectTemplate.findById(template._id)
      .populate('createdBy', 'name email');
    
    return createSuccessResponse({ template: populatedTemplate });
    
  } catch (error) {
    console.error('Update template error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a project template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const template = await ProjectTemplate.findById(id);
    if (!template) {
      return createErrorResponse('Template not found', 404);
    }
    
    // Check if user is the creator
    if (template.createdBy.toString() !== MOCK_USER_ID) {
      return createErrorResponse('Access denied', 403);
    }
    
    await ProjectTemplate.findByIdAndDelete(id);
    
    return createSuccessResponse({ message: 'Template deleted successfully' });
    
  } catch (error) {
    console.error('Delete template error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
