"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Loader2,
  ExternalLink,
  FileText,
  FileQuestion,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Grid,
  X,
  Search,
  Eye
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"

// Set the workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  fileUrl: string
  isPreview?: boolean
  previewLimit?: number
  onRequirePurchase?: () => void
  isMobile?: boolean
}

// Supported document types
const SUPPORTED_FORMATS = {
  pdf: ['.pdf'],
  word: ['.doc', '.docx', '.docm', '.dot', '.dotx'],
  excel: ['.xls', '.xlsx', '.xlsm', '.xlt', '.xltx'],
  powerpoint: ['.ppt', '.pptx', '.pptm', '.pot', '.potx'],
  text: ['.txt', '.rtf', '.md', '.csv'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
}

export default function PdfViewer({
  fileUrl,
  isPreview = false,
  previewLimit = 5,
  onRequirePurchase = () => {},
  isMobile = false,
}: PdfViewerProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string>("")
  const [fileCategory, setFileCategory] = useState<string>("")
  const [textContent, setTextContent] = useState<string>("")
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(true)
  const [customPageInput, setCustomPageInput] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("viewer")
  
  const containerRef = useRef<HTMLDivElement>(null)
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-hide controls on mobile after 3 seconds
  useEffect(() => {
    if (!isMobile || !showControls) return
    
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
    
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
    
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [showControls, isMobile])

  // Touch to show controls
  useEffect(() => {
    if (!isMobile || fileCategory !== 'pdf') return

    const handleTouch = () => {
      setShowControls(true)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouch, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouch)
      }
    }
  }, [isMobile, fileCategory])

  useEffect(() => {
    if (!fileUrl) {
      setError("No file URL provided")
      setLoading(false)
      return
    }

    // Extract file extension
    const extension = fileUrl.substring(fileUrl.lastIndexOf('.')).toLowerCase()
    setFileType(extension)
    
    // Determine file category
    let category = "unknown"
    for (const [cat, exts] of Object.entries(SUPPORTED_FORMATS)) {
      if (exts.includes(extension)) {
        category = cat
        break
      }
    }
    setFileCategory(category)
    
    // Reset state
    setLoading(true)
    setError(null)

    // Load text content for text files
    if (category === 'text') {
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return response.text()
        })
        .then(text => {
          setTextContent(text.slice(0, 50000))
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to load text file:", err)
          setTextContent("Unable to load text content. Please download the file to view.")
          setLoading(false)
        })
    } else {
      setTimeout(() => setLoading(false), 500)
    }
  }, [fileUrl])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error("Failed to load PDF document:", err)
    setError(`Failed to load PDF document: ${err.message}`)
    setLoading(false)
  }, [])

  const handleDownload = () => {
    try {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => Math.max(prev - 1, 1))
    if (isMobile) setShowControls(true)
  }, [isMobile])

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => {
      if (isPreview && prev >= previewLimit) {
        onRequirePurchase()
        return prev
      }
      return Math.min(prev + 1, numPages || 1)
    })
    if (isMobile) setShowControls(true)
  }, [isPreview, previewLimit, onRequirePurchase, numPages, isMobile])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page)
      if (isMobile) setShowControls(true)
    }
  }, [numPages, isMobile])

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3))
    if (isMobile) setShowControls(true)
  }, [isMobile])

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
    if (isMobile) setShowControls(true)
  }, [isMobile])

  const resetZoom = useCallback(() => {
    setZoom(1)
    if (isMobile) setShowControls(true)
  }, [isMobile])

  const rotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360)
    if (isMobile) setShowControls(true)
  }, [isMobile])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
    if (isMobile) setShowControls(true)
  }, [isMobile])

  const handleCustomPageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = parseInt(customPageInput)
    if (!isNaN(page)) {
      goToPage(page)
      setCustomPageInput("")
    }
  }

  // Get viewer URLs for Office documents
  const getGoogleDocsViewerUrl = () => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
  }

  const getMicrosoftViewerUrl = () => {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`
  }

  // Get file icon based on type
  const getFileIcon = () => {
    switch (fileCategory) {
      case 'pdf': return '📄'
      case 'word': return '📝'
      case 'excel': return '📊'
      case 'powerpoint': return '📽️'
      case 'image': return '🖼️'
      case 'text': return '📃'
      default: return '📁'
    }
  }

  // PDF Controls Component - Same buttons for mobile and desktop
  const PDFControls = () => {
    if (fileCategory !== 'pdf' || loading) return null

    const controlBg = isDark ? 'bg-gray-900/95' : 'bg-white/95'
    const textColor = isDark ? 'text-white' : 'text-gray-900'
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200'
    const buttonVariant = isDark ? "outline" : "secondary"

    return (
      <>
        {/* Mobile - Fixed Bottom Controls */}
        {isMobile && (
          <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className={`${controlBg} backdrop-blur-md border-t ${borderColor} p-3`}>
              {/* Page Navigation */}
              <div className="flex items-center justify-between mb-3">
                <Button
                  size="sm"
                  variant={buttonVariant}
                  className="h-9"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex flex-col items-center">
                  <span className={`${textColor} text-sm font-medium`}>
                    Page {pageNumber} of {numPages || "..."}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    Tap to navigate
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant={buttonVariant}
                  className="h-9"
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 1) || (isPreview && pageNumber >= previewLimit)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Zoom and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={buttonVariant}
                    className="h-9"
                    onClick={zoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <span className={`${textColor} text-sm min-w-[50px] text-center`}>
                    {Math.round(zoom * 100)}%
                  </span>
                  
                  <Button
                    size="sm"
                    variant={buttonVariant}
                    className="h-9"
                    onClick={zoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant={buttonVariant} className="h-9">
                        <Grid className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className={`h-[50vh] ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                      <div className="p-4">
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Jump to Page
                        </h3>
                        <form onSubmit={handleCustomPageSubmit} className="mb-4">
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Page number"
                              value={customPageInput}
                              onChange={(e) => setCustomPageInput(e.target.value)}
                              min="1"
                              max={numPages || 1}
                              className="flex-1"
                            />
                            <Button type="submit" size="sm">Go</Button>
                          </div>
                        </form>
                        <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[30vh]">
                          {Array.from({ length: Math.min(numPages || 0, 50) }, (_, i) => i + 1).map(page => (
                            <Button
                              key={page}
                              variant={page === pageNumber ? "default" : "outline"}
                              size="sm"
                              className="h-10"
                              onClick={() => {
                                goToPage(page)
                                document.querySelector('[data-state="closed"]')?.click()
                              }}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button size="sm" variant={buttonVariant} className="h-9" onClick={rotate}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button size="sm" variant={buttonVariant} className="h-9" onClick={resetZoom}>
                    <Search className="h-4 w-4" />
                  </Button>

                  <Button size="sm" variant={buttonVariant} className="h-9" onClick={toggleFullscreen}>
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>

                  <Button size="sm" variant="default" className="h-9" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop - Fixed Bottom Controls */}
        {!isMobile && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`${controlBg} backdrop-blur-md rounded-2xl p-4 shadow-2xl ${borderColor} border`}>
              <div className="flex items-center gap-4">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={goToPrevPage} 
                    disabled={pageNumber <= 1} 
                    variant={buttonVariant}
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex flex-col items-center min-w-[120px]">
                    <span className={`${textColor} text-sm font-medium`}>
                      Page {pageNumber} of {numPages || "..."}
                    </span>
                    <div className="flex gap-1 mt-1">
                      <Input
                        type="number"
                        value={pageNumber}
                        onChange={(e) => goToPage(parseInt(e.target.value) || pageNumber)}
                        min="1"
                        max={numPages || 1}
                        className={`w-16 h-6 text-sm text-center ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                      />
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className={`h-6 ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
                        onClick={() => goToPage(pageNumber)}
                      >
                        Go
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={goToNextPage} 
                    disabled={pageNumber >= (numPages || 1)} 
                    variant={buttonVariant}
                    size="sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Separator */}
                <div className={`h-8 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={zoomOut} 
                    variant={buttonVariant} 
                    size="sm"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className={`${textColor} text-sm min-w-[50px] text-center`}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button 
                    onClick={zoomIn} 
                    variant={buttonVariant} 
                    size="sm"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={resetZoom} 
                    variant={buttonVariant} 
                    size="sm"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Separator */}
                <div className={`h-8 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={rotate} 
                    variant={buttonVariant} 
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={toggleFullscreen} 
                    variant={buttonVariant} 
                    size="sm"
                  >
                    {fullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    onClick={handleDownload} 
                    variant="default" 
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Loading Document...</p>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg ${
        isDark ? 'border-red-500/50 bg-gray-900' : 'border-red-500/50 bg-gray-50'
      }`}>
        <FileQuestion className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Error Loading Document</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {error}
        </p>
        <Button onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Try Downloading Instead
        </Button>
      </div>
    )
  }

  // Handle PDF files
  if (fileCategory === 'pdf') {
    const pageWidth = isMobile ? window.innerWidth - 32 : 800

    return (
      <div ref={containerRef} className="relative h-full overflow-hidden">
        <PDFControls />
        
        {/* PDF Document Area */}
        <div className={`flex justify-center ${isMobile ? 'h-full overflow-auto pb-20' : 'py-8'}`}>
          <div className={`${isMobile ? 'w-full px-4' : 'max-w-5xl'} relative`}>
            {isPreview && pageNumber > previewLimit && (
              <div className={`absolute inset-0 ${isDark ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm z-40 flex items-center justify-center`}>
                <div className={`text-center p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg mx-4 max-w-sm`}>
                  <Eye className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Preview Limit Reached</h3>
                  <p className="text-muted-foreground mb-4">
                    You've viewed the first {previewLimit} pages. Purchase to unlock full access.
                  </p>
                  <Button onClick={onRequirePurchase} size="lg">
                    Unlock Full Document
                  </Button>
                </div>
              </div>
            )}
            
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                width={pageWidth}
                scale={zoom}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className={isMobile ? "touch-pan-y select-none" : ""}
              />
            </Document>
          </div>
        </div>
      </div>
    )
  }

  // Handle Office documents
  if (['word', 'excel', 'powerpoint'].includes(fileCategory)) {
    const documentType = fileCategory.charAt(0).toUpperCase() + fileCategory.slice(1)

    const OfficeViewer = () => (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-900' : 'bg-white'} border-b p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {documentType} Document
              </span>
            </div>
            <Button onClick={handleDownload} size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tabs */}
          {isMobile ? (
            <div className="flex mt-4">
              {['microsoft', 'google', 'download'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-3 text-center text-sm ${activeTab === tab 
                    ? isDark ? 'border-b-2 border-blue-500 text-blue-500' : 'border-b-2 border-blue-600 text-blue-600'
                    : isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'microsoft' ? 'MS' : tab === 'google' ? 'Google' : 'Save'}
                </button>
              ))}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="microsoft" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Microsoft Viewer
                </TabsTrigger>
                <TabsTrigger value="google" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Google Viewer
                </TabsTrigger>
                <TabsTrigger value="download" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        {/* Viewer Content */}
        <div className="flex-1">
          {(activeTab === 'microsoft' || activeTab === 'google') && (
            <div className="h-full">
              <iframe
                src={activeTab === 'microsoft' ? getMicrosoftViewerUrl() : getGoogleDocsViewerUrl()}
                title={`${documentType} Document`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
          )}
          
          {activeTab === 'download' && (
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className={`w-20 h-20 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
                <Download className={`h-10 w-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Download Document
              </h3>
              <p className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Save to view with full functionality
              </p>
              <Button onClick={handleDownload} size="lg" className="w-full max-w-xs">
                <Download className="h-5 w-5 mr-2" />
                Download Now
              </Button>
            </div>
          )}
        </div>
      </div>
    )
    
    return <OfficeViewer />
  }

  // Handle text files
  if (fileCategory === 'text') {
    return (
      <div className="flex flex-col h-full">
        <div className={`border rounded-lg overflow-hidden shadow-lg flex-1 flex flex-col ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`p-4 border-b ${
            isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
          } flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <FileText className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Text File ({fileType.toUpperCase()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {textContent.length.toLocaleString()} chars
              </span>
              <Button onClick={handleDownload} size={isMobile ? "sm" : "default"}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <pre className={`font-mono text-sm whitespace-pre-wrap break-all p-4 rounded h-full ${
              isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-900'
            }`}>
              {textContent || "Loading text content..."}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  // Handle images
  if (fileCategory === 'image') {
    const [localFullscreen, setLocalFullscreen] = useState(false)

    const ImageViewer = () => {
      if (localFullscreen) {
        return (
          <Dialog open={localFullscreen} onOpenChange={setLocalFullscreen}>
            <DialogContent className="max-w-[100vw] h-[100vh] p-0 border-0">
              <div className="relative h-full bg-black">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/70"
                  onClick={() => setLocalFullscreen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
                <img
                  src={fileUrl}
                  alt="Document Image Fullscreen"
                  className="w-full h-full object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )
      }

      return (
        <div className="flex flex-col h-full">
          <div className={`border rounded-lg overflow-hidden shadow-lg flex-1 flex flex-col ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`p-4 border-b ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Image ({fileType.toUpperCase()})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isMobile && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setLocalFullscreen(true)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={handleDownload}
                    size={isMobile ? "sm" : "default"}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
              <img
                src={fileUrl}
                alt="Document Image"
                className="max-w-full max-h-full object-contain rounded-lg bg-white dark:bg-gray-900 p-2"
                onClick={isMobile ? () => setLocalFullscreen(true) : undefined}
                style={{ cursor: isMobile ? 'pointer' : 'default' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%23999">Image not available</text></svg>'
                }}
              />
            </div>
          </div>
        </div>
      )
    }

    return <ImageViewer />
  }

  // Default view for unsupported files
  return (
    <div className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg h-full ${
      isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-50'
    }`}>
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">
        Unsupported File Format
      </h3>
      <p className="text-muted-foreground text-center text-sm mb-6 max-w-md">
        This {fileType.toUpperCase()} file cannot be previewed in the browser.
      </p>
      
      <div className="w-full max-w-sm">
        <Button 
          onClick={handleDownload} 
          className="w-full gap-3 py-4"
          size={isMobile ? "default" : "lg"}
        >
          <Download className="w-4 h-4" />
          Download {fileType.toUpperCase()} File
        </Button>
      </div>
    </div>
  )
}
