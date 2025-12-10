"use client"

import React, { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Set the workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker.min.js`

interface PdfViewerProps {
  fileUrl: string
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Removed containerWidth state and useEffect for simplification

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF loaded successfully. Number of pages:", numPages);
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (err: Error) => {
    console.error("Failed to load PDF document:", err)
    setError("Failed to load PDF document. Please try again later. Error: " + err.message)
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1))
  }

  console.log("PdfViewer state:", { fileUrl, pageNumber, numPages, loading, error }); // Removed containerWidth from log

  if (loading) {
    return <div className="text-center py-8">Loading PDF...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-3xl border border-border rounded-lg overflow-hidden shadow-lg">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="w-full"
        >
          {/* Using a fixed width for now to rule out dynamic sizing issues */}
          <Page pageNumber={pageNumber} width={800} />
        </Document>
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <p className="text-sm text-muted-foreground">
          Page {pageNumber} of {numPages || "..."}
        </p>
        <Button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
