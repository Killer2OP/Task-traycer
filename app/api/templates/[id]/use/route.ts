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
 * POST /api/templates/[id]/use
 * Use a template to create a new project
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { projectName, projectDescription, startDate } = await request.json();
    
    const template = await ProjectTemplate.findById(id);
    if (!template) {
      return createErrorResponse('Template not found', 404);
    }
    
    // Create project from template
    const project = new Project({
      name: projectName || template.name,
      description: projectDescription || template.description,
      owner: MOCK_USER_ID,
      collaborators: [],
      status: 'planning',
      priority: 'medium',
      tags: template.tags,
      startDate: startDate ? new Date(startDate) : new Date(),
    });
    
    await project.save();
    
    // Create plans from template
    const createdPlans = [];
    for (const planTemplate of template.plans) {
      const plan = new Plan({
        name: planTemplate.name,
        description: planTemplate.description,
        project: project._id,
        tasks: [],
        status: 'draft',
        priority: 'medium',
        tags: [],
      });
      
      await plan.save();
      
      // Create tasks from template
      const createdTasks = [];
      for (const taskTemplate of planTemplate.tasks) {
        const task = new Task({
          title: taskTemplate.title,
          description: taskTemplate.description,
          plan: plan._id,
          priority: taskTemplate.priority,
          estimatedHours: taskTemplate.estimatedHours,
          tags: taskTemplate.tags,
          dependencies: [],
          status: 'todo',
        });
        
        await task.save();
        createdTasks.push(task._id);
      }
      
      plan.tasks = createdTasks;
      await plan.save();
      
      createdPlans.push(plan._id);
    }
    
    // Create milestones from template
    const createdMilestones = [];
    for (const milestoneTemplate of template.milestones) {
      const dueDate = new Date(startDate || new Date());
      dueDate.setDate(dueDate.getDate() + milestoneTemplate.dueDateOffset);
      
      const milestone = new Milestone({
        name: milestoneTemplate.name,
        description: milestoneTemplate.description,
        project: project._id,
        dueDate,
        status: 'pending',
        tasks: [],
      });
      
      await milestone.save();
      createdMilestones.push(milestone._id);
    }
    
    project.milestones = createdMilestones;
    await project.save();
    
    // Increment usage count
    template.usageCount += 1;
    await template.save();
    
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')
      .populate('milestones');
    
    return createSuccessResponse({ project: populatedProject }, 201);
    
  } catch (error) {
    console.error('Use template error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
