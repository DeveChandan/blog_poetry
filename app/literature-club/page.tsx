import type { Metadata } from "next"
import { connectDB } from "@/lib/db"
import LiteratureClubClient, {
  type Creator,
  type ClubVideo,
  type ClubSettings,
} from "@/components/literature-club-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "RSUNKAHI Literature Club | हर आवाज़ को मंच, हर रचना को पहचान",
  description:
    "RSUNKAHI Literature Club is a digital literary initiative dedicated to discovering, encouraging and celebrating creative voices — poets, shayars, writers and storytellers.",
}

function serialize<T>(data: any): T {
  return JSON.parse(JSON.stringify(data))
}

export default async function LiteratureClubPage() {
  let creators: Creator[] = []
  let videos: ClubVideo[] = []
  let settings: ClubSettings | null = null

  try {
    const db = await connectDB()
    const [rawCreators, rawClubVideos, rawAllVideos, rawSettings] = await Promise.all([
      db
        .collection("creators")
        .find({})
        .sort({ order: 1, createdAt: -1 })
        .toArray()
        .catch(() => []),
      db
        .collection("videos")
        .find({ playlist: "RSUNKAHI Literature Club – Monthly Sessions" })
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray()
        .catch(() => []),
      db
        .collection("videos")
        .find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray()
        .catch(() => []),
      db
        .collection("settings")
        .findOne({})
        .catch(() => null),
    ])

    creators = serialize<Creator[]>(rawCreators)
    const selectedVideos = rawClubVideos.length > 0 ? rawClubVideos : rawAllVideos
    videos = serialize<ClubVideo[]>(selectedVideos).filter((v) => Boolean(v.youtubeId))
    settings = rawSettings ? serialize<ClubSettings>(rawSettings) : null
  } catch (error) {
    console.error("Failed to load Literature Club page data:", error)
  }

  return <LiteratureClubClient creators={creators} videos={videos} settings={settings} />
}
