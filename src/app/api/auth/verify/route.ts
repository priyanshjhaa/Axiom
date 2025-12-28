import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sharedUsersStorage } from '@/lib/shared-users';

export async function POST(request: NextRequest) {
  console.log('=== Verify credentials endpoint called ===');

  try {
    const { email, password } = await request.json();
    console.log('Verify request for:', { email, hasPassword: !!password });

    const users = sharedUsersStorage.getUsers();
    console.log('Available users from SHARED storage:', Object.keys(users));

    const user = users[email];

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({
        success: false,
        error: 'User not found',
        availableUsers: Object.keys(users)
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    return NextResponse.json({
      success: isPasswordValid,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Verify endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}