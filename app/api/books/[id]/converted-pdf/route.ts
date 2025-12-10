import { NextRequest, NextResponse } from 'next/server'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id
    
    // Check if converted PDF exists in storage
    // This is a mock - in production, check your storage (S3, local storage, etc.)
    const mockPdfUrl = `/api/converted/${bookId}/document.pdf`
    
    // Simulate checking if file exists
    const fileExists = Math.random() > 0.5 // Mock: 50% chance file exists
    
    if (fileExists) {
      return NextResponse.json({ 
        exists: true,
        pdfUrl: mockPdfUrl,
        convertedAt: new Date().toISOString()
      })
    } else {
      return NextResponse.json({ 
        exists: false,
        message: 'No converted PDF found'
      })
    }
  } catch (error) {
    console.error('Error checking converted PDF:', error)
    return NextResponse.json({ 
      error: 'Failed to check converted PDF'
    }, { status: 500 })
  }
}