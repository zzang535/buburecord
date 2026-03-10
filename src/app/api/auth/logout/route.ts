import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create response and clear cookies
    const response = NextResponse.json(
      { message: 'logout_success' },
      { status: 200 }
    );

    // Clear access_token and refresh_token cookies
    response.cookies.set('access_token', '', { maxAge: 0 });
    response.cookies.set('refresh_token', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'logout_server_error' },
      { status: 500 }
    );
  }
}
