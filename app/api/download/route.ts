import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')
    const filename = searchParams.get('filename') || 'document.pdf'

    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 })
    }

    // Fetch the file
    const response = await fetch(fileUrl)
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch file',
        status: response.status 
      }, { status: response.status })
    }

    // Get the file buffer
    const buffer = await response.arrayBuffer()
    
    // Return the file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ 
      error: 'Download failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}