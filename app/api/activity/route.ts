import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import Project from '@/models/Project';
import Plan from '@/models/Plan';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

export interface ActivityItem {
  id: string;
  type: 'task' | 'project' | 'plan';
  title: string;
  status: string;
  priority: string;
  timestamp: Date;
  projectName?: string;
  planName?: string;
  assignee?: {
    name: string;
    email: string;
  };
}

/**
 * GET /api/activity
 * Get recent activity across all user's projects
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { limit = '10' } = Object.fromEntries(request.nextUrl.searchParams);
    const limitNum = parseInt(limit);
    
    // Get user's projects
    const projects = await Project.find({
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    });
    
    const projectIds = projects.map(p => p._id);
    
    // Get recent tasks from user's projects
    const recentTasks = await Task.find({
      plan: { $in: await Plan.find({ project: { $in: projectIds } }).distinct('_id') }
    })
      .populate('assignee', 'name email')
      .populate({
        path: 'plan',
        populate: {
          path: 'project',
          select: 'name'
        }
      })
      .sort({ updatedAt: -1 })
      .limit(limitNum);
    
    // Transform tasks into activity items
    const activities: ActivityItem[] = recentTasks.map(task => ({
      id: task._id.toString(),
      type: 'task',
      title: task.title,
      status: task.status,
      priority: task.priority,
      timestamp: task.updatedAt,
      projectName: (task.plan as any)?.project?.name || 'Unknown Project',
      planName: (task.plan as any)?.name || 'Unknown Plan',
      assignee: task.assignee ? {
        name: (task.assignee as any).name || 'Unknown User',
        email: (task.assignee as any).email || 'unknown@example.com'
      } : undefined
    }));
    
    // Get recent projects
    const recentProjects = await Project.find({
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    })
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 })
      .limit(Math.max(1, Math.floor(limitNum / 3)));
    
    // Add project activities
    const projectActivities: ActivityItem[] = recentProjects.map(project => ({
      id: project._id.toString(),
      type: 'project',
      title: project.name,
      status: project.status,
      priority: project.priority,
      timestamp: project.updatedAt,
      assignee: project.owner ? {
        name: (project.owner as any).name || 'Unknown User',
        email: (project.owner as any).email || 'unknown@example.com'
      } : {
        name: 'Unknown User',
        email: 'unknown@example.com'
      }
    }));
    
    // Get recent plans
    const recentPlans = await Plan.find({
      project: { $in: projectIds }
    })
      .populate('project', 'name')
      .sort({ updatedAt: -1 })
      .limit(Math.max(1, Math.floor(limitNum / 3)));
    
    // Add plan activities
    const planActivities: ActivityItem[] = recentPlans.map(plan => ({
      id: plan._id.toString(),
      type: 'plan',
      title: plan.name,
      status: plan.status,
      priority: plan.priority,
      timestamp: plan.updatedAt,
      projectName: (plan.project as any)?.name || 'Unknown Project'
    }));
    
    // Combine and sort all activities by timestamp
    const allActivities = [...activities, ...projectActivities, ...planActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limitNum);
    
    return createSuccessResponse({ activities: allActivities });
    
  } catch (error) {
    console.error('Get activity error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
