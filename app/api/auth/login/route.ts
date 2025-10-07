import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

/**
 * POST /api/auth/login
 * Login user
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return createErrorResponse('Email and password are required');
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return createErrorResponse('Invalid email or password', 401);
    }
    
    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return createErrorResponse('Invalid email or password', 401);
    }
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    return createSuccessResponse({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
