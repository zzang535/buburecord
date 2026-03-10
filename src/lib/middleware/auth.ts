import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';
import cookie from 'cookie';

export interface AuthUser {
  id: number;
  username: string;
}

/**
 * Verify authentication from request cookies
 * @param request - Next.js request object
 * @returns User data if authenticated, null otherwise
 *
 * Authentication flow:
 * 1. Try to verify access_token
 * 2. If access_token valid, return user data
 * 3. If access_token expired, try refresh_token
 * 4. If refresh_token valid, return user data (caller should set new access_token)
 * 5. If both invalid, return null
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Parse cookies from request headers
    const cookieHeader = request.headers.get('cookie') || '';
    const parsedCookies = cookie.parse(cookieHeader);

    const { access_token, refresh_token } = parsedCookies;

    // Try to verify access token first
    try {
      if (!access_token) {
        throw new Error('No access token');
      }
      const decodedAccess = verifyToken(access_token);
      return {
        id: decodedAccess.id,
        username: decodedAccess.username,
      };
    } catch (accessError) {
      // Access token invalid or expired, try refresh token
      console.log('Access token error:', accessError);

      try {
        if (!refresh_token) {
          throw new Error('No refresh token');
        }
        const decodedRefresh = verifyToken(refresh_token);
        return {
          id: decodedRefresh.id,
          username: decodedRefresh.username,
        };
      } catch (refreshError) {
        // Both tokens invalid
        console.log('Refresh token error:', refreshError);
        return null;
      }
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}
