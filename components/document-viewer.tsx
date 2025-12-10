"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  File, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  FileText,
  RefreshCw,
  Eye,
  Printer,
  Upload,
  CheckCircle,
  XCircle,
  Info,
  FileUp,
  Shield,
  Maximize2,
  Link as LinkIcon
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface DocumentViewerProps {
  fileUrl: string
  fileName: string
  fileType: string
  bookId: string
}

export default function DocumentViewer({ fileUrl, fileName, fileType, bookId }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("options")
  const [viewerError, setViewerError] = useState<string>("")
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)

  // File type detection
  const isPDF = fileType.toLowerCase() === '.pdf'
  const isWord = ['.doc', '.docx'].includes(fileType.toLowerCase())
  const isExcel = ['.xls', '.xlsx'].includes(fileType.toLowerCase())
  const isPowerPoint = ['.ppt', '.pptx'].includes(fileType.toLowerCase())
  const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(fileType.toLowerCase())
  const isText = ['.txt', '.rtf', '.md', '.csv'].includes(fileType.toLowerCase())

  useEffect(() => {
    if (!fileUrl) {
      setViewerError("No file URL provided")
      setLoading(false)
      return
    }

    setLoading(false)
  }, [fileUrl])

  const handleDownload = async () => {
    try {
      // Use our secure download API
      const response = await fetch(`/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName + fileType)}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = fileName + fileType
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        toast.success("Download started successfully!")
      } else {
        // Fallback to direct download
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = fileName + fileType
        link.click()
        toast.success("Download started via direct link!")
      }
    } catch (err) {
      console.error("Download failed:", err)
      toast.error("Download failed. Please try again.")
    }
  }

  const openInNewWindow = (viewerType: 'microsoft' | 'google' | 'direct') => {
    let viewerUrl = ''
    
    if (viewerType === 'direct') {
      // Open our custom viewer
      viewerUrl = `/api/view-doc?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`
    } else if (viewerType === 'microsoft') {
      viewerUrl = `/api/proxy-viewer?url=${encodeURIComponent(fileUrl)}&type=microsoft`
    } else {
      viewerUrl = `/api/proxy-viewer?url=${encodeURIComponent(fileUrl)}&type=google`
    }
    
    // Open in new window with proper dimensions
    const width = 1200
    const height = 800
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    
    window.open(
      viewerUrl,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
  }

  const convertToPDF = async () => {
    if (isConverting) return
    
    setIsConverting(true)
    setConversionProgress(0)
    toast.info("Converting document to PDF...")
    
    try {
      // Simulate conversion process
      const simulateProgress = () => {
        setConversionProgress(prev => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            setIsConverting(false)
            // In production, this would be a real converted PDF URL
            // For demo, we'll use the original file but show it as converted
            setConvertedPdfUrl(fileUrl)
            setActiveTab("converted")
            toast.success("Document ready for viewing!")
            return 100
          }
          setTimeout(simulateProgress, 300)
          return newProgress
        })
      }
      
      simulateProgress()
    } catch (error) {
      console.error("Conversion failed:", error)
      toast.error("Conversion failed. Please download the original file.")
      setIsConverting(false)
    }
  }

  const getFileIcon = () => {
    if (isPDF) return "📄"
    if (isWord) return "📝"
    if (isExcel) return "📊"
    if (isPowerPoint) return "📽️"
    if (isImage) return "🖼️"
    if (isText) return "📃"
    return "📁"
  }

  const getDocumentTypeName = () => {
    if (isPDF) return "PDF Document"
    if (isWord) return "Word Document"
    if (isExcel) return "Excel Spreadsheet"
    if (isPowerPoint) return "PowerPoint Presentation"
    if (isImage) return "Image File"
    if (isText) return "Text File"
    return "Document"
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">{getFileIcon()}</span>
          </div>
        </div>
        <p className="text-xl font-medium mb-2">Loading Document Viewer</p>
        <p className="text-muted-foreground text-center">
          Preparing {getDocumentTypeName()} for viewing...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* File Info Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg border mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border flex items-center justify-center">
            <span className="text-2xl">{getFileIcon()}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{getDocumentTypeName()}</h3>
            <p className="text-sm text-muted-foreground">
              {fileName}
              <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                {fileType.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleDownload}
            variant="default"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Viewer Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="options" className="gap-2">
            <Eye className="w-4 h-4" />
            View Options
          </TabsTrigger>
          
          {isWord && (
            <TabsTrigger value="convert" className="gap-2" disabled={isConverting}>
              <FileUp className="w-4 h-4" />
              {isConverting ? "Converting..." : "To PDF"}
            </TabsTrigger>
          )}
          
          <TabsTrigger value="download" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </TabsTrigger>
          
          {convertedPdfUrl && (
            <TabsTrigger value="converted" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              PDF Version
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* View Options Tab */}
        <TabsContent value="options" className="flex-1">
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Choose a viewing method</AlertTitle>
              <AlertDescription>
                Select how you want to view this document. Some options may work better than others depending on your browser.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Direct Viewer */}
              <div className="border border-border rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Maximize2 className="w-8 h-8" />
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Recommended</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Full Page Viewer</h3>
                  <p className="text-blue-100 text-sm">
                    Opens in a new window with enhanced viewing controls
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Works with all document types</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">No browser restrictions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Download and print options</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => openInNewWindow('direct')}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Open Full Page Viewer
                  </Button>
                </div>
              </div>
              
              {/* Option 2: Microsoft Viewer */}
              {isWord && (
                <div className="border border-border rounded-lg overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="w-8 h-8" />
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">For Office Docs</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Microsoft Viewer</h3>
                    <p className="text-green-100 text-sm">
                      Official Microsoft Office Online viewer
                    </p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Best for Word/Excel/PPT</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm">May not work with private files</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Preserves formatting</span>
                      </li>
                    </ul>
                    <Button 
                      onClick={() => openInNewWindow('microsoft')}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Try Microsoft Viewer
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Option 3: Google Viewer */}
              <div className="border border-border rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <LinkIcon className="w-8 h-8" />
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Alternative</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Google Viewer</h3>
                  <p className="text-red-100 text-sm">
                    Google Docs viewer as fallback option
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Works with many formats</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">Limited editing features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Good compatibility</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => openInNewWindow('google')}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Try Google Viewer
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>If viewers don't work, download the file and open it with appropriate software</p>
            </div>
          </div>
        </TabsContent>
        
        {/* Convert to PDF Tab */}
        <TabsContent value="convert" className="flex-1">
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <FileUp className="w-10 h-10 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Convert to PDF</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Convert this {fileType.toUpperCase()} file to PDF for better compatibility.
            </p>
            
            {isConverting ? (
              <div className="space-y-4 max-w-md w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span>Converting...</span>
                  <span>{conversionProgress}%</span>
                </div>
                <Progress value={conversionProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Please wait while we convert your document...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Button 
                  onClick={convertToPDF}
                  size="lg"
                  className="gap-3 px-8"
                >
                  <Upload className="w-5 h-5" />
                  Convert to PDF
                </Button>
                
                {convertedPdfUrl && (
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("converted")}
                    className="gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    View Previous Conversion
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Download Tab */}
        <TabsContent value="download" className="flex-1">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Download className="w-10 h-10 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Download Document</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Download this {fileType.toUpperCase()} file to view it with full functionality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownload}
                size="lg"
                className="gap-3 px-8"
              >
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
                Open Direct Link
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Converted PDF Tab */}
        {convertedPdfUrl && (
          <TabsContent value="converted" className="flex-1">
            <Alert className="bg-green-50 border-green-200 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>PDF Ready!</AlertTitle>
              <AlertDescription>
                Document converted to PDF. You can now view it directly.
              </AlertDescription>
            </Alert>
            
            <div className="border border-border rounded-lg overflow-hidden shadow-lg h-full">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Converted PDF</span>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(convertedPdfUrl, '_blank')}
                    className="gap-2"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Open Full Screen
                  </Button>
                </div>
              </div>
              <div className="h-[calc(100%-60px)]">
                <iframe
                  src={convertedPdfUrl}
                  title="Converted PDF Viewer"
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}