import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  console.log('=== Registration API called ===');

  try {
    // Add timeout and error handling for JSON parsing
    let body;
    try {
      body = await request.json();
      console.log('Request body received:', body);
    } catch (jsonError) {
      console.error('Failed to parse request JSON:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = body;

    console.log('Destructured values:', { firstName, lastName, email, hasPassword: !!password });

    console.log('Registration attempt:', { email, firstName, lastName });

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: `User already exists with this email: ${email}` },
        { status: 409 }
      );
    }

    // Hash password
    let hashedPassword;
    try {
      console.log('Starting password hashing...');
      hashedPassword = await bcrypt.hash(password, 12);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Password hashing failed:', hashError);
      return NextResponse.json(
        { error: 'Failed to process password' },
        { status: 500 }
      );
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    console.log('User registered successfully in database:', { id: user.id, email, firstName, lastName });

    const response = {
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    };

    console.log('Sending response:', response);
    console.log('=== Registration completed successfully ===');

    const finalResponse = NextResponse.json(response, { status: 201 });
    console.log('Response created:', finalResponse);

    return finalResponse;

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}