"use client"

import React, { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  File, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  FileText,
  FileQuestion,
  RefreshCw,
  Eye,
  Printer
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Set the workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  fileUrl: string
  pageNumber: number
  onPageChange: (page: number) => void
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

export default function PdfViewer({ fileUrl, pageNumber, onPageChange }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string>("")
  const [fileCategory, setFileCategory] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("viewer")
  const [viewerError, setViewerError] = useState<string>("")
  const [textContent, setTextContent] = useState<string>("")

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
    
    console.log("File detected:", { extension, category, fileUrl })
    
    // Reset state
    setLoading(true)
    setError(null)
    setViewerError("")

    // Load text content for text files
    if (category === 'text') {
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return response.text()
        })
        .then(text => {
          setTextContent(text.slice(0, 50000)) // Limit to 50k chars
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF loaded successfully. Number of pages:", numPages);
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (err: Error) => {
    console.error("Failed to load PDF document:", err)
    setError(`Failed to load PDF document. ${err.message}`)
    setLoading(false)
  }

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
      setViewerError("Download failed. Please try again.")
    }
  }

  const goToPrevPage = () => {
    onPageChange(Math.max(pageNumber - 1, 1))
  }

  const goToNextPage = () => {
    onPageChange(Math.min(pageNumber + 1, numPages || 1))
  }

  // Generate viewer URLs
  const getGoogleDocsViewerUrl = () => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
  }

  const getMicrosoftViewerUrl = () => {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`
  }

  const getPDFFillerViewerUrl = () => {
    return `https://www.pdffiller.com/en/featured.htm?url=${encodeURIComponent(fileUrl)}`
  }

  // Handle iframe error
  const handleIframeError = () => {
    setViewerError("Unable to load document preview. The document may be too large, private, or in an unsupported format.")
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

  // Get viewer options for the file type
  const getViewerOptions = () => {
    const options = []
    
    if (fileCategory === 'pdf') {
      options.push({ id: 'native', name: 'Native PDF Viewer', description: 'Best quality' })
    }
    
    if (['word', 'excel', 'powerpoint'].includes(fileCategory)) {
      options.push(
        { id: 'microsoft', name: 'Microsoft Viewer', description: 'Official viewer' },
        { id: 'google', name: 'Google Docs Viewer', description: 'Alternative viewer' }
      )
    } else if (fileCategory !== 'pdf') {
      options.push(
        { id: 'google', name: 'Google Docs Viewer', description: 'Best compatibility' }
      )
    }
    
    options.push({ id: 'download', name: 'Download Only', description: 'View on your device' })
    
    return options
  }

  const viewerOptions = getViewerOptions()

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">{getFileIcon()}</span>
          </div>
        </div>
        <p className="text-xl font-medium mb-2">Loading Document</p>
        <p className="text-muted-foreground text-center">
          Preparing {fileType.toUpperCase().replace('.', '')} file for viewing...
        </p>
      </div>
    )
  }

  // Handle PDF files - Native viewer
  if (fileCategory === 'pdf' && activeTab === 'viewer') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-3xl border border-border rounded-lg overflow-hidden shadow-lg bg-white">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="w-full"
            loading={
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              width={800}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
        
        <div className="flex items-center justify-between w-full max-w-3xl">
          <div className="flex items-center space-x-4">
            <Button onClick={goToPrevPage} disabled={pageNumber <= 1} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {pageNumber} of {numPages || "..."}
            </p>
            <Button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)} variant="outline">
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} variant="secondary" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button 
              onClick={() => window.open(fileUrl, '_blank')}
              variant="outline"
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Handle Office documents with multiple viewer options
  if (['word', 'excel', 'powerpoint'].includes(fileCategory)) {
    const documentType = fileCategory.charAt(0).toUpperCase() + fileCategory.slice(1)
    
    return (
      <div className="flex flex-col space-y-6">
        {/* Viewer Selection Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
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
          
          {/* Microsoft Viewer */}
          <TabsContent value="microsoft" className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle>Microsoft Office Online Viewer</AlertTitle>
              <AlertDescription>
                This viewer requires the document to be publicly accessible. If you see an error, try the Google Viewer or download option.
              </AlertDescription>
            </Alert>
            
            {viewerError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{viewerError}</AlertDescription>
              </Alert>
            )}
            
            <div className="border border-border rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">
                      {documentType} Document - Microsoft Viewer
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewerError("")}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </Button>
                </div>
              </div>
              
              <div className="h-[600px]">
                <iframe
                  src={getMicrosoftViewerUrl()}
                  title={`${documentType} Document - Microsoft Viewer`}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  onError={handleIframeError}
                  onLoad={(e) => {
                    const iframe = e.target as HTMLIFrameElement
                    try {
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                      if (iframeDoc?.body?.innerText?.includes('error') || 
                          iframeDoc?.body?.innerText?.includes('cannot') ||
                          iframeDoc?.body?.innerText?.includes('unable')) {
                        handleIframeError()
                      }
                    } catch (err) {
                      // Cross-origin error, assume it loaded
                    }
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Google Viewer */}
          <TabsContent value="google" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Google Docs Viewer</AlertTitle>
              <AlertDescription>
                Alternative viewer for documents. May have limited functionality compared to Microsoft Viewer.
              </AlertDescription>
            </Alert>
            
            <div className="border border-border rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-green-600" />
                  <span className="font-medium">
                    {documentType} Document - Google Viewer
                  </span>
                </div>
              </div>
              
              <div className="h-[600px]">
                <iframe
                  src={getGoogleDocsViewerUrl()}
                  title={`${documentType} Document - Google Viewer`}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  onError={handleIframeError}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Download Option */}
          <TabsContent value="download" className="space-y-6">
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-4xl">{getFileIcon()}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Download Document</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Download this {fileType.toUpperCase()} file to view it with full functionality in Microsoft Office or compatible software.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownload} size="lg" className="gap-3 px-8">
                  <Download className="w-5 h-5" />
                  Download Now
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="gap-3 px-8"
                  onClick={() => window.open(fileUrl, '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  Open in New Tab
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-md">
                <h4 className="font-medium mb-3">Recommended Software:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">•</span>
                    <span><strong>Microsoft Office</strong> - Full compatibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>LibreOffice</strong> - Free alternative</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Google Docs</strong> - Upload and view online</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>OnlyOffice</strong> - Open source alternative</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{documentType} Document</p>
                <p className="text-sm text-muted-foreground">{fileType.toUpperCase()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button 
              variant="default"
              className="gap-2"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Handle text files
  if (fileCategory === 'text') {
    return (
      <div className="flex flex-col space-y-6">
        <div className="border border-border rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium">
                Text File Viewer ({fileType.toUpperCase()})
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {textContent.length.toLocaleString()} characters
            </div>
          </div>
          
          <div className="p-6 h-[600px] overflow-auto bg-gray-50">
            <pre className="font-mono text-sm whitespace-pre-wrap break-words bg-white p-4 rounded border">
              {textContent || "Loading text content..."}
            </pre>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Plain text viewer • Basic formatting only
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleDownload} variant="default" className="gap-2">
              <Download className="w-4 h-4" />
              Download Text File
            </Button>
            <Button 
              variant="outline"
              className="gap-2"
              onClick={() => {
                const blob = new Blob([textContent], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `document${fileType}`
                link.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Handle images
  if (fileCategory === 'image') {
    return (
      <div className="flex flex-col space-y-6">
        <div className="border border-border rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-medium">
                  Image Viewer ({fileType.toUpperCase()})
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-8 bg-gray-50">
            <img
              src={fileUrl}
              alt="Document Image"
              className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg bg-white p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%23999">Image not available</text></svg>'
              }}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {fileType.toUpperCase()} Image • View only
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleDownload} variant="default" className="gap-2">
              <Download className="w-4 h-4" />
              Download Image
            </Button>
            <Button 
              variant="outline"
              className="gap-2"
              onClick={() => window.open(fileUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Open Full Size
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default view for unsupported or unknown files
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold mb-2">Unsupported File Format</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        This {fileType.toUpperCase()} file cannot be previewed in the browser. 
        Please download it to view with appropriate software.
      </p>
      
      <div className="space-y-4 w-full max-w-sm">
        <Button 
          onClick={handleDownload} 
          className="w-full gap-3 py-6"
          size="lg"
        >
          <Download className="w-5 h-5" />
          Download {fileType.toUpperCase()} File
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full gap-3"
          onClick={() => window.open(fileUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
          Try Opening in Browser
        </Button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-md">
        <h4 className="font-medium mb-3">Supported formats for preview:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>PDF (.pdf)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">✓</span>
            <span>Word (.doc, .docx)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">✓</span>
            <span>Excel (.xls, .xlsx)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">✓</span>
            <span>PowerPoint (.ppt, .pptx)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Images (JPG, PNG, etc.)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Text files (.txt, .rtf)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
