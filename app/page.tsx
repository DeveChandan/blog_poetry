import { connectDB } from "@/lib/db"
import VintageHome from "@/components/vintage-home"

// Cache rendered home page for 60s; admin mutations also call revalidatePath('/')
export const revalidate = 60

function serialize<T>(data: any): T {
  return JSON.parse(JSON.stringify(data))
}

async function getHomeData() {
  try {
    const db = await connectDB()

    const [featuredPoems, recentBooks, sliders, recentVideo, settings] = await Promise.all([
      (async () => {
        let poems = await db
          .collection("poems")
          .find({ featured: true }, { projection: { title: 1 } })
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray()
        if (poems.length === 0) {
          poems = await db
            .collection("poems")
            .find({}, { projection: { title: 1 } })
            .sort({ createdAt: -1 })
            .limit(6)
            .toArray()
        }
        return serialize<any[]>(poems)
      })().catch(() => []),
      db
        .collection("books")
        .find({}, { projection: { cover: 1, title: 1 } })
        .sort({ createdAt: -1 })
        .limit(2)
        .toArray()
        .then((res) => serialize<any[]>(res))
        .catch(() => []),
      db
        .collection("sliders")
        .find({ active: true }, { projection: { image: 1, title: 1 } })
        .sort({ order: 1, createdAt: -1 })
        .toArray()
        .then((res) => serialize<any[]>(res))
        .catch(() => []),
      db
        .collection("videos")
        .findOne({}, { sort: { createdAt: -1 }, projection: { title: 1, youtubeId: 1 } })
        .then((res) => (res ? serialize<any>(res) : null))
        .catch(() => null),
      db
        .collection("settings")
        .findOne(
          {},
          {
            projection: {
              featuredInstagramReel: 1,
              facebook: 1,
              twitter: 1,
              instagram: 1,
              youtube: 1,
              linkedin: 1,
              email: 1,
            },
          }
        )
        .then((res) => (res ? serialize<any>(res) : null))
        .catch(() => null),
    ])

    return { featuredPoems, recentBooks, sliders, recentVideo, settings }
  } catch (error) {
    console.error("Failed to fetch home page data:", error)
    return {
      featuredPoems: [],
      recentBooks: [],
      sliders: [],
      recentVideo: null,
      settings: null,
    }
  }
}

export default async function Home() {
  const { featuredPoems, recentBooks, sliders, recentVideo, settings } = await getHomeData()

  return (
    <main className="min-h-screen">
      <VintageHome
        stats={null}
        featuredPoems={featuredPoems}
        recentBooks={recentBooks}
        recentBlogs={[]}
        sliders={sliders}
        recentVideo={recentVideo}
        settings={settings}
      />
    </main>
  )
}
