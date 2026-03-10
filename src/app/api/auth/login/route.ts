import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/db';
import { makePasswordHashed } from '@/lib/utils/crypto';
import { createAccessToken, createRefreshToken, getCookieOptions } from '@/lib/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Find user by username
    const findUser = await User.findOne({ where: { username } });

    if (!findUser) {
      return NextResponse.json(
        { code: 400, message: 'no_account' },
        { status: 400 }
      );
    }

    console.log('Found user:', {
      id: findUser.id,
      username: findUser.username,
      hasSalt: !!findUser.salt,
      saltLength: findUser.salt?.length,
    });

    // Hash input password with stored salt and compare
    const { hashed_password } = await makePasswordHashed(findUser.salt, password);

    if (hashed_password !== findUser.password) {
      return NextResponse.json(
        { code: 400, message: 'password_do_not_match' },
        { status: 400 }
      );
    }

    // Create tokens
    const userData = {
      id: findUser.id,
      username: findUser.username,
    };

    const accessToken = createAccessToken(userData);
    const refreshToken = createRefreshToken(userData);

    // Create response with cookies
    const response = NextResponse.json(
      {
        code: 200,
        message: 'login_success',
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
      { code: 500, message: 'login_server_error' },
      { status: 500 }
    );
  }
}
