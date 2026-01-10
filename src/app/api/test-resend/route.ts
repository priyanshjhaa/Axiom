import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: 'RESEND_API_KEY not found in environment',
        keyExists: false,
        keyValue: null
      });
    }

    // Check if it's the placeholder
    if (process.env.RESEND_API_KEY === 'paste_your_resend_api_key_here') {
      return NextResponse.json({
        error: 'RESEND_API_KEY is still the placeholder',
        keyExists: true,
        needsUpdate: true
      });
    }

    // Try to initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Test sending a simple email
    console.log('Testing Resend API...');
    console.log('API Key (first 10 chars):', process.env.RESEND_API_KEY.substring(0, 10) + '...');

    const result = await resend.emails.send({
      from: 'AXIOM Test <onboarding@resend.dev>',
      to: 'test@example.com', // This will fail but we can see the error
      subject: 'Test Email',
      html: '<p>This is a test</p>'
    });

    return NextResponse.json({
      success: true,
      message: 'Resend API is working!',
      result: result
    });

  } catch (error: any) {
    console.error('Resend test error:', error);
    return NextResponse.json({
      error: error.message,
      name: error.name,
      stack: error.stack
    }, { status: 500 });
  }
}
