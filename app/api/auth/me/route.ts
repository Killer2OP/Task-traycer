import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/api-utils';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

/**
 * GET /api/auth/me
 * Get current user information
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = authenticateRequest(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401);
    }
    
    const user = await User.findById(auth.userId).select('-password');
    if (!user) {
      return createErrorResponse('User not found', 404);
    }
    
    return createSuccessResponse({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
