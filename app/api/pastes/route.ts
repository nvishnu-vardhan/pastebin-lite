import { NextRequest, NextResponse } from 'next/server';
import { createPaste, getPaste } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, ttlSeconds, maxViews } = body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (ttlSeconds !== undefined && (typeof ttlSeconds !== 'number' || ttlSeconds < 1)) {
      return NextResponse.json(
        { error: 'ttlSeconds must be an integer >= 1' },
        { status: 400 }
      );
    }

    if (maxViews !== undefined && (typeof maxViews !== 'number' || maxViews < 1)) {
      return NextResponse.json(
        { error: 'maxViews must be an integer >= 1' },
        { status: 400 }
      );
    }

    // Create the paste
    const paste = await createPaste(content, ttlSeconds, maxViews);

    return NextResponse.json(
      {
        id: paste.id,
        url: `/p/${paste.id}`,
        created_at: paste.created_at,
        expires_at: paste.expires_at,
        remaining_views: paste.max_views,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Failed to create paste' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      );
    }

    const paste = await getPaste(id);

    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found, expired, or view limit exceeded' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: paste.id,
        content: paste.content,
        expires_at: paste.expires_at,
        remaining_views: paste.max_views !== null ? paste.max_views - paste.view_count : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paste' },
      { status: 500 }
    );
  }
}
