import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fileUrl = searchParams.get('url')

  if (!fileUrl) {
    return NextResponse.json({ accessible: false, error: 'No URL provided' })
  }

  try {
    // Simple HEAD request to check if file is accessible
    const response = await fetch(fileUrl, { method: 'HEAD' })
    
    return NextResponse.json({ 
      accessible: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type')
    })
  } catch (error) {
    console.error('Access check failed:', error)
    return NextResponse.json({ 
      accessible: false, 
      error: 'Access check failed' 
    })
  }
}