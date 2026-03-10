import { NextRequest, NextResponse } from 'next/server';
import { Feed } from '@/lib/db';
import { verifyAuth } from '@/lib/middleware/auth';

/**
 * GET /api/album/list
 * Get all albums for the authenticated user
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { code: 401, message: 'unauthorized' },
        { status: 401 }
      );
    }

    // Query all feeds for the authenticated user
    const feeds = await Feed.findAll({
      where: { user_id: user.id },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(
      {
        message: '앨범 리스트 조회 성공',
        data: feeds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Album list error:', error);
    return NextResponse.json(
      { message: '앨범 리스트 조회 실패' },
      { status: 500 }
    );
  }
}
