import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectTemplate from '@/models/ProjectTemplate';
import Project from '@/models/Project';
import Plan from '@/models/Plan';
import Task from '@/models/Task';
import Milestone from '@/models/Milestone';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/templates
 * Get all project templates
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { category, search } = Object.fromEntries(request.nextUrl.searchParams);
    
    let query: any = { isPublic: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const templates = await ProjectTemplate.find(query)
      .populate('createdBy', 'name email')
      .sort({ usageCount: -1, createdAt: -1 });
    
    return createSuccessResponse({ templates });
    
  } catch (error) {
    console.error('Get templates error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * POST /api/templates
 * Create a new project template
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, description, category, plans, milestones, tags, isPublic } = await request.json();
    
    if (!name || !category) {
      return createErrorResponse('Name and category are required');
    }
    
    const template = new ProjectTemplate({
      name,
      description: description || '',
      category,
      plans: plans || [],
      milestones: milestones || [],
      tags: tags || [],
      isPublic: isPublic || false,
      createdBy: MOCK_USER_ID,
    });
    
    await template.save();
    
    const populatedTemplate = await ProjectTemplate.findById(template._id)
      .populate('createdBy', 'name email');
    
    return createSuccessResponse({ template: populatedTemplate }, 201);
    
  } catch (error) {
    console.error('Create template error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

