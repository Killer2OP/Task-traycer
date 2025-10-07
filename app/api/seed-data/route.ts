import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Plan from '@/models/Plan';
import Task from '@/models/Task';
import User from '@/models/User';
import Agent from '@/models/Agent';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * POST /api/seed-data
 * Create sample data for demo purposes
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if data already exists
    const existingProjects = await Project.find({});
    const existingAgents = await Agent.find({});
    if (existingProjects.length > 0 && existingAgents.length > 0) {
      return createSuccessResponse({ message: 'Sample data already exists' });
    }
    
    // Create a mock user
    const mockUser = new User({
      _id: MOCK_USER_ID,
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'hashedpassword', // In real app, this would be properly hashed
    });
    
    try {
      await mockUser.save();
    } catch (error) {
      // User might already exist, continue
    }
    
    // Create sample projects
    const projects = [
      {
        name: 'E-commerce Platform',
        description: 'Build a modern e-commerce platform with React and Node.js',
        status: 'active',
        priority: 'high',
        progress: 45,
        tags: ['web', 'ecommerce', 'react'],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        budget: 50000,
      },
      {
        name: 'Mobile App Development',
        description: 'Create a cross-platform mobile app using React Native',
        status: 'planning',
        priority: 'medium',
        progress: 15,
        tags: ['mobile', 'react-native', 'ios', 'android'],
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        budget: 75000,
      },
      {
        name: 'API Integration Project',
        description: 'Integrate multiple third-party APIs for data processing',
        status: 'completed',
        priority: 'low',
        progress: 100,
        tags: ['api', 'integration', 'backend'],
        startDate: new Date('2023-11-01'),
        endDate: new Date('2023-12-31'),
        budget: 25000,
      }
    ];
    
    const createdProjects = [];
    for (const projectData of projects) {
      const project = new Project({
        ...projectData,
        owner: MOCK_USER_ID,
        collaborators: [],
        milestones: [],
      });
      await project.save();
      createdProjects.push(project);
    }
    
    // Create sample plans for each project
    const plans = [];
    for (const project of createdProjects) {
      const planData = {
        name: `${project.name} - Development Plan`,
        description: `Comprehensive development plan for ${project.name}`,
        project: project._id,
        status: project.status === 'completed' ? 'completed' : 'active',
        priority: project.priority,
        progress: project.progress,
        tags: project.tags,
        startDate: project.startDate,
        endDate: project.endDate,
        estimatedHours: project.budget ? Math.floor(project.budget / 100) : 200,
        actualHours: project.budget ? Math.floor(project.budget / 120) : 150,
      };
      
      const plan = new Plan(planData);
      await plan.save();
      plans.push(plan);
    }
    
    // Create sample agents
    const agents = [
      {
        name: 'CodeReviewer Pro',
        description: 'Specialized AI agent for code review and quality assurance',
        type: 'code-reviewer',
        status: 'active',
        capabilities: ['code-review', 'bug-detection', 'performance-analysis'],
        configuration: {
          maxConcurrentTasks: 5,
          workingHours: { start: '09:00', end: '17:00' },
          autoAcceptTasks: true,
          priorityThreshold: 'medium',
          skills: ['javascript', 'typescript', 'react', 'node.js'],
          aiModel: 'gpt-4',
          customInstructions: 'Focus on code quality, security vulnerabilities, and performance optimization.'
        },
        performance: {
          tasksCompleted: 12,
          averageCompletionTime: 2.5,
          successRate: 95,
          lastActive: new Date(),
          totalHoursWorked: 30,
          currentWorkload: 2,
          efficiencyScore: 92,
          responseTime: 15,
          qualityScore: 94
        }
      },
      {
        name: 'TaskExecutor AI',
        description: 'General-purpose task execution agent for development work',
        type: 'task-executor',
        status: 'active',
        capabilities: ['task-execution', 'feature-development', 'refactoring'],
        configuration: {
          maxConcurrentTasks: 3,
          workingHours: { start: '08:00', end: '18:00' },
          autoAcceptTasks: false,
          priorityThreshold: 'high',
          skills: ['fullstack', 'api-development', 'database-design'],
          aiModel: 'gpt-4',
          customInstructions: 'Prioritize high-quality implementations and follow best practices.'
        },
        performance: {
          tasksCompleted: 8,
          averageCompletionTime: 4.2,
          successRate: 88,
          lastActive: new Date(),
          totalHoursWorked: 34,
          currentWorkload: 1,
          efficiencyScore: 85,
          responseTime: 25,
          qualityScore: 89
        }
      },
      {
        name: 'BugHunter',
        description: 'Dedicated bug detection and fixing specialist',
        type: 'bug-fixer',
        status: 'idle',
        capabilities: ['bug-detection', 'debugging', 'testing'],
        configuration: {
          maxConcurrentTasks: 4,
          workingHours: { start: '10:00', end: '16:00' },
          autoAcceptTasks: true,
          priorityThreshold: 'urgent',
          skills: ['debugging', 'testing', 'error-analysis'],
          aiModel: 'gpt-4',
          customInstructions: 'Focus on critical bugs and security issues first.'
        },
        performance: {
          tasksCompleted: 15,
          averageCompletionTime: 1.8,
          successRate: 92,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          totalHoursWorked: 27,
          currentWorkload: 0,
          efficiencyScore: 90,
          responseTime: 10,
          qualityScore: 93
        }
      }
    ];
    
    const createdAgents = [];
    for (const agentData of agents) {
      const agent = new Agent({
        ...agentData,
        owner: MOCK_USER_ID,
        assignedProjects: [],
        assignedTasks: []
      });
      await agent.save();
      createdAgents.push(agent);
    }
    
    // Create sample tasks for each plan
    const taskTemplates = [
      {
        title: 'Setup project structure',
        description: 'Initialize project with proper folder structure and configuration',
        status: 'completed',
        priority: 'high',
        estimatedHours: 8,
        actualHours: 6,
      },
      {
        title: 'Implement user authentication',
        description: 'Create login, registration, and session management',
        status: 'in-progress',
        priority: 'high',
        estimatedHours: 16,
        actualHours: 12,
      },
      {
        title: 'Create dashboard UI',
        description: 'Build responsive dashboard with modern UI components',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 12,
        actualHours: 0,
      },
      {
        title: 'Database design and setup',
        description: 'Design database schema and implement data models',
        status: 'completed',
        priority: 'high',
        estimatedHours: 10,
        actualHours: 8,
      },
      {
        title: 'API endpoint development',
        description: 'Create RESTful API endpoints for core functionality',
        status: 'in-progress',
        priority: 'medium',
        estimatedHours: 20,
        actualHours: 15,
      },
      {
        title: 'Testing and quality assurance',
        description: 'Implement unit tests and perform QA testing',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 16,
        actualHours: 0,
      },
      {
        title: 'Deployment and DevOps',
        description: 'Set up CI/CD pipeline and deploy to production',
        status: 'todo',
        priority: 'low',
        estimatedHours: 8,
        actualHours: 0,
      }
    ];
    
    const createdTasks = [];
    for (const plan of plans) {
      // Assign different tasks to different plans
      const tasksToCreate = taskTemplates.slice(0, Math.min(5, taskTemplates.length));
      
      for (let i = 0; i < tasksToCreate.length; i++) {
        const taskData = tasksToCreate[i];
        const agent = createdAgents[i % createdAgents.length]; // Assign agents in round-robin
        
        const task = new Task({
          ...taskData,
          plan: plan._id,
          assignee: MOCK_USER_ID,
          agentAssignee: agent._id,
          tags: plan.tags.slice(0, 2), // Use first 2 tags from plan
          dependencies: [],
          attachments: [],
          comments: [],
          subtasks: [],
          agentWorkflow: {
            assignedAt: new Date(),
            progressPercentage: taskData.status === 'completed' ? 100 : 
                              taskData.status === 'in-progress' ? Math.floor(Math.random() * 60) + 20 : 0,
            lastActivityAt: new Date(),
            aiResponse: taskData.status === 'completed' ? 
              `✅ Task completed successfully! ${agent.name} finished ${taskData.title} with high quality.` :
              taskData.status === 'in-progress' ? 
              `🔄 Working on ${taskData.title}... Making good progress with ${agent.name}.` :
              `🤖 Task assigned to ${agent.name}. Ready to begin work.`,
            autoProgressUpdates: [{
              timestamp: new Date(),
              status: taskData.status,
              note: `Task ${taskData.status} by ${agent.name}`,
              progressPercentage: taskData.status === 'completed' ? 100 : 
                                taskData.status === 'in-progress' ? Math.floor(Math.random() * 60) + 20 : 0
            }]
          }
        });
        
        await task.save();
        createdTasks.push(task);
        
        // Add task to plan and agent
        plan.tasks.push(task._id);
        agent.assignedTasks.push(task._id);
        await agent.save();
      }
      
      await plan.save();
    }
    
    return createSuccessResponse({ 
      message: 'Sample data created successfully',
      counts: {
        users: 1,
        projects: createdProjects.length,
        plans: plans.length,
        tasks: createdTasks.length,
        agents: createdAgents.length
      }
    }, 201);
    
  } catch (error) {
    console.error('Create sample data error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
