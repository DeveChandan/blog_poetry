import { connectDB } from "@/lib/db"
import { getSessionUser } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

function extractYouTubeId(input: string): string {
  if (!input) return ''
  
  let id = input.trim()
  
  // Remove any whitespace
  id = id.replace(/\s+/g, '')
  
  // Try different patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s\/\?]+)/,
    /^([A-Za-z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = id.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return ''
}

function getYouTubeThumbnail(youtubeInput: string) {
  const youtubeId = extractYouTubeId(youtubeInput)
  
  if (!youtubeId) {
    console.warn(`Invalid YouTube input: ${youtubeInput}`)
    return ''
  }
  
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
}

export async function GET() {
  try {
    const db = await connectDB()
    const videos = await db.collection("videos").find({}).sort({ createdAt: -1 }).toArray()

    console.log("Processing videos from DB...")
    
    const processedVideos = videos.map((v) => {
      const cleanYoutubeId = extractYouTubeId(v.youtubeId || '')
      const thumbnail = getYouTubeThumbnail(v.youtubeId || '')
      
      console.log(`Video ${v._id}:`, {
        originalInput: v.youtubeId,
        extractedId: cleanYoutubeId,
        thumbnail: thumbnail,
        hasThumbnail: !!thumbnail
      })
      
      return {
        _id: v._id.toString(),
        title: v.title || '',
        description: v.description || '',
        thumbnail: thumbnail,
        views: v.views || 0,
        youtubeId: cleanYoutubeId, // Store clean ID
        originalYoutubeUrl: v.youtubeId, // Keep original for reference
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      }
    })

    return NextResponse.json(processedVideos)
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request)

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, youtubeId } = body

    if (!title || !youtubeId) {
      return NextResponse.json({ error: "Title and YouTube ID are required" }, { status: 400 })
    }

    const db = await connectDB()

    // Extract clean ID and generate thumbnail
    const cleanYoutubeId = extractYouTubeId(youtubeId)
    
    if (!cleanYoutubeId) {
      return NextResponse.json({ 
        error: "Invalid YouTube URL or ID. Please provide a valid YouTube URL or video ID." 
      }, { status: 400 })
    }
    
    const generatedThumbnail = getYouTubeThumbnail(youtubeId)

    const result = await db.collection("videos").insertOne({
      title,
      description: description || "",
      youtubeId: cleanYoutubeId, // Store clean ID
      originalYoutubeUrl: youtubeId, // Also store original if it's a URL
      thumbnail: generatedThumbnail,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      title,
      description,
      youtubeId: cleanYoutubeId,
      thumbnail: generatedThumbnail,
      views: 0,
    })
  } catch (error) {
    console.error("Failed to create video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}
