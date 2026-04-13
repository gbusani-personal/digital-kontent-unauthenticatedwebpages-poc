import { getContentByType } from '../../../lib/kontent';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get('type') || 'home_page';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const content = await getContentByType(contentType, limit);

    return NextResponse.json({
      success: true,
      data: content,
      count: content.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch content from Kontent.ai',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}