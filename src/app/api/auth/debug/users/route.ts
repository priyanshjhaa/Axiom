import { NextRequest, NextResponse } from 'next/server';
import { sharedUsersStorage } from '@/lib/shared-users';

// Development only endpoint to check current users
export async function GET() {
  console.log('=== Debug users endpoint called ===');

  const users = sharedUsersStorage.getUsers();
  console.log('Users from SHARED storage:', users);
  console.log('User emails:', Object.keys(users));
  console.log('User count:', Object.keys(users).length);

  // Remove password hashes for security in response
  const usersWithoutPasswords = Object.keys(users).map(email => ({
    email,
    firstName: users[email].firstName,
    lastName: users[email].lastName,
    createdAt: users[email].createdAt
  }));

  console.log('Sending debug response:', {
    userCount: sharedUsersStorage.getUserCount(),
    users: usersWithoutPasswords
  });

  return NextResponse.json({
    userCount: sharedUsersStorage.getUserCount(),
    users: usersWithoutPasswords
  });
}

// Development only endpoint to reset users (dangerous in production!)
export async function DELETE() {
  sharedUsersStorage.resetUsers();
  return NextResponse.json({
    message: 'Users reset to initial state',
    userCount: sharedUsersStorage.getUserCount()
  });
}