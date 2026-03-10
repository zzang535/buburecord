import { NextRequest, NextResponse } from 'next/server';
import { Feed } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/album/[id]
 * Get a single album by ID
 * Public endpoint (no authentication required)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Find feed by primary key
    const feed = await Feed.findByPk(id);

    return NextResponse.json(
      {
        message: '앨범 하나 조회 성공',
        data: feed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Album detail error:', error);
    return NextResponse.json(
      { message: '앨범 하나 조회 실패' },
      { status: 500 }
    );
  }
}
