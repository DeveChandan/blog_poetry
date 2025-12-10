// app/api/pdf-render/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDocument } from 'pdfjs-dist'

// Disable server-side caching for dynamic content
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')
    const pageNum = parseInt(searchParams.get('page') || '1')

    if (!fileUrl) {
      return NextResponse.json({ error: 'No file URL provided' }, { status: 400 })
    }

    // Fetch the PDF file
    const response = await fetch(fileUrl)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 404 })
    }

    const pdfBuffer = await response.arrayBuffer()
    
    // Initialize PDF.js
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

    // Load the PDF
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer })
    const pdf = await loadingTask.promise

    // Get the requested page
    const page = await pdf.getPage(pageNum)
    
    // Set render scale
    const scale = 1.5
    const viewport = page.getViewport({ scale })

    // Create canvas
    const { createCanvas } = await import('canvas')
    const canvas = createCanvas(viewport.width, viewport.height)
    const context = canvas.getContext('2d')

    // Render the page
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }

    await page.render(renderContext).promise

    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8)

    return NextResponse.json({
      imageUrl: imageData,
      totalPages: pdf.numPages,
      currentPage: pageNum,
      width: viewport.width,
      height: viewport.height
    })

  } catch (error) {
    console.error('PDF render error:', error)
    return NextResponse.json({ 
      error: 'Failed to render PDF page',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}