import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const planSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(100, 'Plan name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

// Validation helper function
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Error handler
export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { 
        error: error.message, 
        type: error.type,
        details: error.details 
      }, 
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        type: ErrorType.VALIDATION_ERROR,
        details: error.errors 
      }, 
      { status: 400 }
    );
  }

  // Database errors
  if (error instanceof Error && error.name === 'MongoError') {
    return NextResponse.json(
      { 
        error: 'Database operation failed', 
        type: ErrorType.DATABASE_ERROR 
      }, 
      { status: 500 }
    );
  }

  // Default error
  return NextResponse.json(
    { 
      error: 'Internal server error', 
      type: ErrorType.INTERNAL_ERROR 
    }, 
    { status: 500 }
  );
}

// Success response helper
export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

// Error response helper
export function createErrorResponse(
  message: string, 
  status: number = 400, 
  type: ErrorType = ErrorType.INTERNAL_ERROR,
  details?: any
): NextResponse {
  return NextResponse.json(
    { error: message, type, details }, 
    { status }
  );
}
