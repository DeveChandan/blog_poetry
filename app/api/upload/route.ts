import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();

  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const { pathname } = await request.json();

  if (!pathname) {
    return NextResponse.json({ error: 'No pathname provided' }, { status: 400 });
  }

  // The `put` function, when called with an empty body, returns a signed URL for client-side uploads.
  // The client-side code will then use this URL to upload the file directly to Vercel Blob.
  try {
    const blob = await put(pathname, '', {
      access: 'public',
      addRandomSuffix: true, // Prevent filename conflicts
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error generating Vercel Blob signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
