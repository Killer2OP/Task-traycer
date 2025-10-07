import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectTemplate from '@/models/ProjectTemplate';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

// Mock user ID for demo purposes
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

/**
 * POST /api/seed-templates
 * Create sample project templates for demo purposes
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if templates already exist
    const existingTemplates = await ProjectTemplate.find({});
    if (existingTemplates.length > 0) {
      return createSuccessResponse({ message: 'Templates already exist' });
    }
    
    const sampleTemplates = [
      {
        name: 'E-commerce Web Application',
        description: 'Complete e-commerce platform with user management, product catalog, shopping cart, and payment integration',
        category: 'web-app',
        plans: [
          {
            name: 'Backend Development',
            description: 'API development and database setup',
            tasks: [
              {
                title: 'Set up project structure',
                description: 'Initialize Node.js/Express project with TypeScript',
                priority: 'high',
                estimatedHours: 4,
                tags: ['backend', 'setup']
              },
              {
                title: 'Design database schema',
                description: 'Create MongoDB schemas for users, products, orders',
                priority: 'high',
                estimatedHours: 6,
                tags: ['database', 'design']
              },
              {
                title: 'Implement user authentication',
                description: 'JWT-based auth with registration/login endpoints',
                priority: 'high',
                estimatedHours: 8,
                tags: ['auth', 'security']
              },
              {
                title: 'Create product management API',
                description: 'CRUD operations for products with image upload',
                priority: 'medium',
                estimatedHours: 10,
                tags: ['api', 'products']
              },
              {
                title: 'Implement shopping cart functionality',
                description: 'Add/remove items, calculate totals, persist cart state',
                priority: 'medium',
                estimatedHours: 8,
                tags: ['cart', 'business-logic']
              },
              {
                title: 'Integrate payment processing',
                description: 'Stripe integration for secure payments',
                priority: 'high',
                estimatedHours: 12,
                tags: ['payments', 'integration']
              }
            ]
          },
          {
            name: 'Frontend Development',
            description: 'React-based user interface with responsive design',
            tasks: [
              {
                title: 'Set up React project',
                description: 'Create Next.js app with TypeScript and Tailwind CSS',
                priority: 'high',
                estimatedHours: 4,
                tags: ['frontend', 'setup']
              },
              {
                title: 'Design component library',
                description: 'Create reusable UI components',
                priority: 'medium',
                estimatedHours: 12,
                tags: ['ui', 'components']
              },
              {
                title: 'Implement user authentication UI',
                description: 'Login/register forms with validation',
                priority: 'high',
                estimatedHours: 8,
                tags: ['auth', 'forms']
              },
              {
                title: 'Create product catalog page',
                description: 'Product listing with search, filters, and pagination',
                priority: 'medium',
                estimatedHours: 10,
                tags: ['products', 'ui']
              },
              {
                title: 'Build shopping cart interface',
                description: 'Cart page with item management and checkout flow',
                priority: 'medium',
                estimatedHours: 8,
                tags: ['cart', 'checkout']
              },
              {
                title: 'Implement responsive design',
                description: 'Mobile-first design with tablet and desktop breakpoints',
                priority: 'medium',
                estimatedHours: 6,
                tags: ['responsive', 'mobile']
              }
            ]
          },
          {
            name: 'Testing & Deployment',
            description: 'Quality assurance and production deployment',
            tasks: [
              {
                title: 'Write unit tests',
                description: 'Test coverage for critical business logic',
                priority: 'medium',
                estimatedHours: 8,
                tags: ['testing', 'unit-tests']
              },
              {
                title: 'Integration testing',
                description: 'Test API endpoints and user flows',
                priority: 'medium',
                estimatedHours: 6,
                tags: ['testing', 'integration']
              },
              {
                title: 'Set up CI/CD pipeline',
                description: 'Automated testing and deployment with GitHub Actions',
                priority: 'high',
                estimatedHours: 6,
                tags: ['devops', 'ci-cd']
              },
              {
                title: 'Deploy to production',
                description: 'Deploy to Vercel/Netlify with environment configuration',
                priority: 'high',
                estimatedHours: 4,
                tags: ['deployment', 'production']
              }
            ]
          }
        ],
        milestones: [
          {
            name: 'MVP Backend Complete',
            description: 'Core API functionality ready for frontend integration',
            dueDateOffset: 14
          },
          {
            name: 'Frontend MVP',
            description: 'Basic user interface with core features',
            dueDateOffset: 28
          },
          {
            name: 'Payment Integration',
            description: 'Secure payment processing implemented',
            dueDateOffset: 35
          },
          {
            name: 'Production Ready',
            description: 'Fully tested and deployed application',
            dueDateOffset: 42
          }
        ],
        tags: ['ecommerce', 'web-app', 'fullstack', 'typescript', 'mongodb'],
        isPublic: true,
        createdBy: MOCK_USER_ID
      },
      {
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application with React Native',
        category: 'mobile-app',
        plans: [
          {
            name: 'Project Setup',
            description: 'Development environment and project initialization',
            tasks: [
              {
                title: 'Set up React Native project',
                description: 'Initialize with Expo or CLI, configure TypeScript',
                priority: 'high',
                estimatedHours: 4,
                tags: ['setup', 'react-native']
              },
              {
                title: 'Configure navigation',
                description: 'Set up React Navigation with stack and tab navigators',
                priority: 'high',
                estimatedHours: 6,
                tags: ['navigation', 'ui']
              },
              {
                title: 'Set up state management',
                description: 'Configure Redux Toolkit or Zustand for app state',
                priority: 'medium',
                estimatedHours: 4,
                tags: ['state', 'redux']
              }
            ]
          },
          {
            name: 'Core Features',
            description: 'Main application functionality',
            tasks: [
              {
                title: 'Implement user authentication',
                description: 'Login/register screens with biometric auth',
                priority: 'high',
                estimatedHours: 10,
                tags: ['auth', 'security']
              },
              {
                title: 'Create main dashboard',
                description: 'Home screen with key metrics and navigation',
                priority: 'medium',
                estimatedHours: 8,
                tags: ['dashboard', 'ui']
              },
              {
                title: 'Build data synchronization',
                description: 'Offline-first data sync with backend API',
                priority: 'high',
                estimatedHours: 12,
                tags: ['sync', 'offline']
              },
              {
                title: 'Implement push notifications',
                description: 'Firebase Cloud Messaging integration',
                priority: 'medium',
                estimatedHours: 6,
                tags: ['notifications', 'firebase']
              }
            ]
          }
        ],
        milestones: [
          {
            name: 'Project Setup Complete',
            description: 'Development environment ready',
            dueDateOffset: 7
          },
          {
            name: 'Core Features MVP',
            description: 'Basic app functionality implemented',
            dueDateOffset: 21
          },
          {
            name: 'Beta Release',
            description: 'Feature-complete app ready for testing',
            dueDateOffset: 35
          }
        ],
        tags: ['mobile', 'react-native', 'cross-platform', 'expo'],
        isPublic: true,
        createdBy: MOCK_USER_ID
      },
      {
        name: 'REST API Development',
        description: 'Scalable REST API with authentication, rate limiting, and documentation',
        category: 'api',
        plans: [
          {
            name: 'API Foundation',
            description: 'Core API structure and middleware',
            tasks: [
              {
                title: 'Set up Express.js server',
                description: 'Initialize with TypeScript, middleware, and error handling',
                priority: 'high',
                estimatedHours: 6,
                tags: ['express', 'typescript', 'setup']
              },
              {
                title: 'Implement authentication middleware',
                description: 'JWT-based auth with role-based access control',
                priority: 'high',
                estimatedHours: 8,
                tags: ['auth', 'middleware', 'security']
              },
              {
                title: 'Add rate limiting',
                description: 'Prevent abuse with rate limiting and request throttling',
                priority: 'medium',
                estimatedHours: 4,
                tags: ['rate-limiting', 'security']
              },
              {
                title: 'Set up logging and monitoring',
                description: 'Structured logging with Winston and health checks',
                priority: 'medium',
                estimatedHours: 6,
                tags: ['logging', 'monitoring']
              }
            ]
          },
          {
            name: 'API Documentation',
            description: 'Comprehensive API documentation',
            tasks: [
              {
                title: 'Generate OpenAPI specification',
                description: 'Create Swagger/OpenAPI docs with examples',
                priority: 'medium',
                estimatedHours: 8,
                tags: ['documentation', 'openapi']
              },
              {
                title: 'Create API testing suite',
                description: 'Postman collection and automated tests',
                priority: 'medium',
                estimatedHours: 6,
                tags: ['testing', 'postman']
              }
            ]
          }
        ],
        milestones: [
          {
            name: 'API Foundation Ready',
            description: 'Core API structure implemented',
            dueDateOffset: 10
          },
          {
            name: 'Documentation Complete',
            description: 'Full API documentation and testing suite',
            dueDateOffset: 20
          }
        ],
        tags: ['api', 'rest', 'express', 'typescript', 'documentation'],
        isPublic: true,
        createdBy: MOCK_USER_ID
      }
    ];
    
    const createdTemplates = await ProjectTemplate.insertMany(sampleTemplates);
    
    return createSuccessResponse({ 
      message: 'Sample templates created successfully',
      templates: createdTemplates 
    }, 201);
    
  } catch (error) {
    console.error('Create sample templates error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
