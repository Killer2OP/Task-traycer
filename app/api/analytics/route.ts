import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Plan from '@/models/Plan';
import Task from '@/models/Task';
import Milestone from '@/models/Milestone';
import Agent from '@/models/Agent';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * GET /api/analytics
 * Get analytics data for the user's projects
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { timeframe = '30d' } = Object.fromEntries(request.nextUrl.searchParams);
    
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Get user's projects
    const projects = await Project.find({
      $or: [
        { owner: MOCK_USER_ID },
        { collaborators: MOCK_USER_ID }
      ]
    });
    
    const projectIds = projects.map(p => p._id);
    
    // Get all tasks for user's projects
    const tasks = await Task.find({
      plan: { $in: await Plan.find({ project: { $in: projectIds } }).distinct('_id') }
    }).populate('agentAssignee');
    
    // Get all milestones for user's projects
    const milestones = await Milestone.find({
      project: { $in: projectIds }
    });
    
    // Get user's agents
    const agents = await Agent.find({
      owner: MOCK_USER_ID
    });
    
    // Calculate analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate time tracking
    const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const totalActualHours = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
    
    // Calculate productivity metrics
    const efficiency = totalEstimatedHours > 0 ? (totalActualHours / totalEstimatedHours) * 100 : 0;
    const timeSaved = totalEstimatedHours - totalActualHours;
    
    // Project status distribution
    const projectStatusCounts = {
      planning: projects.filter(p => p.status === 'planning').length,
      active: projects.filter(p => p.status === 'active').length,
      'on-hold': projects.filter(p => p.status === 'on-hold').length,
      completed: projects.filter(p => p.status === 'completed').length,
      cancelled: projects.filter(p => p.status === 'cancelled').length,
    };
    
    // Task priority distribution
    const taskPriorityCounts = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
    };
    
    // Milestone completion
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const overdueMilestones = milestones.filter(m => m.status === 'overdue').length;
    
    // Recent activity (tasks created/updated in timeframe)
    const recentTasks = tasks.filter(t => 
      t.createdAt >= startDate || t.updatedAt >= startDate
    );
    
    // Team productivity (if collaborators exist)
    const totalTeamMembers = projects.reduce((sum, p) => sum + 1 + (p.collaborators?.length || 0), 0);
    const averageTasksPerMember = totalTeamMembers > 0 ? totalTasks / totalTeamMembers : 0;
    
    // Agent performance analytics
    const agentTasks = tasks.filter(t => t.agentAssignee);
    const agentCompletedTasks = agentTasks.filter(t => t.status === 'completed');
    const agentInProgressTasks = agentTasks.filter(t => t.status === 'in-progress');
    
    // Calculate agent performance metrics
    const totalAgentTasks = agentTasks.length;
    const agentCompletionRate = totalAgentTasks > 0 ? (agentCompletedTasks.length / totalAgentTasks) * 100 : 0;
    
    // Agent efficiency metrics
    const totalAgentHours = agents.reduce((sum, agent) => sum + agent.performance.totalHoursWorked, 0);
    const averageAgentEfficiency = agents.length > 0 
      ? agents.reduce((sum, agent) => sum + agent.performance.efficiencyScore, 0) / agents.length 
      : 0;
    
    // Agent workload distribution
    const agentWorkloads = agents.map(agent => ({
      agentId: agent._id,
      agentName: agent.name,
      currentTasks: agent.performance.currentWorkload,
      completedTasks: agent.performance.tasksCompleted,
      efficiency: agent.performance.efficiencyScore,
      status: agent.status
    }));
    
    // Calculate trends (simplified - in real app, you'd store historical data)
    const tasksCompletedThisWeek = tasks.filter(t => 
      t.status === 'completed' && 
      t.updatedAt >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const tasksCompletedLastWeek = tasks.filter(t => 
      t.status === 'completed' && 
      t.updatedAt >= new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) &&
      t.updatedAt < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const productivityTrend = tasksCompletedLastWeek > 0 
      ? ((tasksCompletedThisWeek - tasksCompletedLastWeek) / tasksCompletedLastWeek) * 100 
      : 0;
    
    const analytics = {
      overview: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        blockedTasks,
        totalMilestones,
        completedMilestones,
        overdueMilestones,
        completionRate: Math.round(completionRate),
        efficiency: Math.round(efficiency),
        timeSaved: Math.round(timeSaved),
        productivityTrend: Math.round(productivityTrend),
      },
      projectStatus: projectStatusCounts,
      taskPriority: taskPriorityCounts,
      timeTracking: {
        totalEstimatedHours: Math.round(totalEstimatedHours),
        totalActualHours: Math.round(totalActualHours),
        efficiency: Math.round(efficiency),
        timeSaved: Math.round(timeSaved),
      },
      team: {
        totalMembers: totalTeamMembers,
        averageTasksPerMember: Math.round(averageTasksPerMember),
      },
      recentActivity: {
        tasksCreated: recentTasks.filter(t => t.createdAt >= startDate).length,
        tasksUpdated: recentTasks.filter(t => t.updatedAt >= startDate && t.createdAt < startDate).length,
      },
      trends: {
        productivityTrend: Math.round(productivityTrend),
        completionRate: Math.round(completionRate),
        efficiency: Math.round(efficiency),
      },
      agents: {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        totalAgentTasks: totalAgentTasks,
        agentCompletedTasks: agentCompletedTasks.length,
        agentInProgressTasks: agentInProgressTasks.length,
        agentCompletionRate: Math.round(agentCompletionRate),
        totalAgentHours: Math.round(totalAgentHours),
        averageAgentEfficiency: Math.round(averageAgentEfficiency),
        agentWorkloads: agentWorkloads
      }
    };
    
    return createSuccessResponse({ analytics });
    
  } catch (error) {
    console.error('Get analytics error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
