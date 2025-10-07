import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, name } = await request.json();
    
    // Validate input
    if (!email || !password || !name) {
      return createErrorResponse('Email, password, and name are required');
    }
    
    if (password.length < 6) {
      return createErrorResponse('Password must be at least 6 characters long');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return createErrorResponse('User with this email already exists', 409);
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    return createSuccessResponse({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    }, 201);
    
  } catch (error) {
    console.error('Registration error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
