import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

/**
 * Middleware to authenticate API routes
 */
export function authenticateRequest(request: NextRequest): { userId: string } | null {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader || undefined);
  
  if (!token) {
    return null;
  }
  
  const decoded = verifyToken(token);
  return decoded;
}

/**
 * Create an error response
 */
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a success response
 */
export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
