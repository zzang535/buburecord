import jwt from 'jsonwebtoken';

// Token expiration times
const JWT_ACCESS_EXPIRATION_TIME = '10s';
const JWT_REFRESH_EXPIRATION_TIME = '7d';

// Cookie expiration time (7 days in milliseconds)
export const COOKIE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;

// Payload interface for JWT tokens
interface TokenPayload {
  id: number;
  username: string;
}

/**
 * Creates an access token with a short expiration time (10 seconds)
 */
export function createAccessToken(payload: TokenPayload): string {
  const secret = process.env.TOKEN_SECRET_KEY;

  if (!secret) {
    throw new Error('TOKEN_SECRET_KEY environment variable is not set');
  }

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: JWT_ACCESS_EXPIRATION_TIME,
  });
}

/**
 * Creates a refresh token with a longer expiration time (7 days)
 */
export function createRefreshToken(payload: TokenPayload): string {
  const secret = process.env.TOKEN_SECRET_KEY;

  if (!secret) {
    throw new Error('TOKEN_SECRET_KEY environment variable is not set');
  }

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: JWT_REFRESH_EXPIRATION_TIME,
  });
}

/**
 * Verifies a token and returns the decoded payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token: string): any {
  const secret = process.env.TOKEN_SECRET_KEY;

  if (!secret) {
    throw new Error('TOKEN_SECRET_KEY environment variable is not set');
  }

  return jwt.verify(token, secret);
}

/**
 * Returns cookie options based on the environment
 */
export function getCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'none';
  maxAge: number;
} {
  const isDevelopment = process.env.APP_ENVIRONMENT === 'development';

  return {
    httpOnly: true,
    secure: !isDevelopment,
    sameSite: isDevelopment ? 'lax' : 'none',
    maxAge: COOKIE_EXPIRATION_TIME,
  };
}
