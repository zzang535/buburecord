import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/db';
import { createHashedPassword } from '@/lib/utils/crypto';
import { createAccessToken, createRefreshToken, getCookieOptions } from '@/lib/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Create hashed password with salt
    const { hashed_password, salt } = await createHashedPassword(password);

    // Create user in database
    const createUser = await User.create({
      username,
      password: hashed_password,
      salt,
    });

    // Create tokens
    const userData = {
      id: createUser.id,
      username: createUser.username,
    };

    const accessToken = createAccessToken(userData);
    const refreshToken = createRefreshToken(userData);

    // Create response with cookies
    const response = NextResponse.json(
      {
        code: 200,
        message: 'join_success',
        data: userData,
      },
      { status: 200 }
    );

    const cookieOptions = getCookieOptions();

    response.cookies.set('access_token', accessToken, cookieOptions);
    response.cookies.set('refresh_token', refreshToken, cookieOptions);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { code: 500, message: 'join_server_error' },
      { status: 500 }
    );
  }
}
