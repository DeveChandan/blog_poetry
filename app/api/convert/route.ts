import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import os from 'os'

// For production, you would use a proper conversion service
// This is a mock implementation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileUrl, bookId, fileName } = body

    if (!fileUrl) {
      return NextResponse.json({ error: 'No file URL provided' }, { status: 400 })
    }

    // Create a SSE stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial progress
        controller.enqueue(encoder.encode('data: ' + JSON.stringify({ progress: 10 }) + '\n\n'))

        try {
          // Step 1: Download the file
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ progress: 25, message: 'Downloading file...' }) + '\n\n'))
          
          const response = await fetch(fileUrl)
          if (!response.ok) {
            throw new Error(`Failed to download file: ${response.status}`)
          }

          const fileBuffer = await response.arrayBuffer()
          
          // Step 2: Create temporary file
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ progress: 40, message: 'Processing document...' }) + '\n\n'))
          
          const tempDir = path.join(os.tmpdir(), 'doc-conversions')
          if (!existsSync(tempDir)) {
            await mkdir(tempDir, { recursive: true })
          }
          
          const tempFilePath = path.join(tempDir, `${bookId}-${Date.now()}${path.extname(fileName)}`)
          await writeFile(tempFilePath, Buffer.from(fileBuffer))
          
          // Step 3: Simulate conversion (in production, use libreoffice-convert or similar)
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ progress: 60, message: 'Converting to PDF...' }) + '\n\n'))
          
          // Simulate conversion delay
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ progress: 85, message: 'Finalizing PDF...' }) + '\n\n'))
          
          // Step 4: Create mock PDF URL (in production, save to storage and return URL)
          const pdfUrl = `/api/converted/${bookId}/${fileName.replace(/\.[^/.]+$/, "")}.pdf`
          
          // Step 5: Send completion
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ 
            progress: 100, 
            pdfUrl,
            message: 'Conversion complete!' 
          }) + '\n\n'))
          
          // Cleanup temp file
          await unlink(tempFilePath).catch(() => {})
          
          controller.close()
        } catch (error) {
          console.error('Conversion error:', error)
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ 
            error: 'Conversion failed',
            message: error instanceof Error ? error.message : 'Unknown error'
          }) + '\n\n'))
          controller.close()
        }
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Conversion API error:', error)
    return NextResponse.json({ 
      error: 'Conversion failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}