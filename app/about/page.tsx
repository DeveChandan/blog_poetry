"use client"

import { useEffect, useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Briefcase, 
  BookOpen, 
  PenTool, 
  Video, 
  Code, 
  Globe, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter,
  Award,
  Calendar,
  FileText,
  Smartphone,
  Database,
  Cloud,
  Server,
  Cpu,
  Smartphone as Mobile,
  Globe as Web,
  Terminal,
  Layers,
  Shield,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Settings {
  siteName?: string
  siteDescription?: string
  authorBio?: string
  authorImage?: string
  youtubeChannel?: string
  email?: string
  github?: string
  linkedin?: string
  twitter?: string
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [recentVideos, setRecentVideos] = useState<any[]>([])
  const [stats, setStats] = useState({
    yearsExperience: 5,
    projectsCompleted: 80,
    poemsWritten: 120,
    videosCreated: 0,
    appsPublished: 15
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch settings
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
        }

        // Fetch recent videos
        const videosRes = await fetch("/api/videos?limit=3")
        if (videosRes.ok) {
          const videosData = await videosRes.json()
          setRecentVideos(videosData)
          setStats(prev => ({ ...prev, videosCreated: videosData.length }))
        }

      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Technical Skills by Category
  const techSkills = {
    "Mobile Development": [
      { name: "React Native", level: 95 },
      { name: "Android Native (Java/Kotlin)", level: 85 },
      { name: "iOS Development", level: 75 },
      { name: "Flutter", level: 70 },
      { name: "Mobile CI/CD", level: 90 }
    ],
    "Frontend Development": [
      { name: "React/Next.js", level: 98 },
      { name: "TypeScript", level: 95 },
      { name: "Vue.js", level: 80 },
      { name: "Tailwind CSS", level: 98 },
      { name: "GraphQL", level: 85 }
    ],
    "Backend & Databases": [
      { name: "Node.js/Express", level: 95 },
      { name: "Python/Django", level: 85 },
      { name: "MongoDB", level: 90 },
      { name: "PostgreSQL", level: 88 },
      { name: "Redis", level: 82 }
    ],
    "SAP & Enterprise": [
      { name: "SAP ABAP", level: 90 },
      { name: "SAP OData Services", level: 92 },
      { name: "SAP WMS (Warehouse Management)", level: 85 },
      { name: "SAP Fiori", level: 80 },
      { name: "SAP Integration", level: 88 }
    ],
    "DevOps & Cloud": [
      { name: "AWS", level: 85 },
      { name: "Docker", level: 90 },
      { name: "Kubernetes", level: 80 },
      { name: "Jenkins", level: 85 },
      { name: "Azure DevOps", level: 75 }
    ]
  }

  const projects = [
    {
      category: "Mobile App",
      title: "Warehouse Management Mobile App",
      description: "React Native app integrated with SAP WMS for real-time inventory tracking and management",
      tech: ["React Native", "SAP OData", "Redux", "AWS"],
      year: "2023"
    },
    {
      category: "Enterprise",
      title: "SAP OData Integration Platform",
      description: "Custom OData service layer for SAP integration with external systems",
      tech: ["SAP ABAP", "OData", "Node.js", "PostgreSQL"],
      year: "2022"
    },
    {
      category: "Full Stack",
      title: "E-Learning Platform",
      description: "Complete online education platform with mobile apps and admin dashboard",
      tech: ["Next.js", "React Native", "MongoDB", "AWS"],
      year: "2023"
    }
  ]

  const certifications = [
    { name: "AWS Certified Developer", issuer: "Amazon", year: "2023" },
    { name: "SAP ABAP Development", issuer: "SAP", year: "2022" },
    { name: "React Native Certified", issuer: "Meta", year: "2023" },
    { name: "Google Cloud Professional", issuer: "Google", year: "2022" }
  ]

  const socialLinks = [
    { icon: Github, href: settings.github, label: "GitHub" },
    { icon: Linkedin, href: settings.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: settings.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${settings.email}`, label: "Email" }
  ].filter(link => link.href)

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-xl mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-muted rounded-2xl overflow-hidden border shadow-lg mb-6">
                <img
                  src={"https://chandan-mondal.vercel.app/static/media/boy.470ef50417e4496f10a1.png" || "/placeholder-avatar.jpg"}
                  alt="Chandan Mondal"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Experience</span>
                      <span className="font-bold">{stats.yearsExperience}+ Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Projects</span>
                      <span className="font-bold">{stats.projectsCompleted}+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Mobile Apps</span>
                      <span className="font-bold">{stats.appsPublished}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Videos</span>
                      <span className="font-bold">{stats.videosCreated}+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header */}
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2">
                Chandan Mondal
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <p className="text-xl text-primary font-medium">
                  Full Stack Developer | SAP Consultant | Mobile App Developer
                </p>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Full Stack Developer with {stats.yearsExperience}+ years of expertise in React Native, 
                SAP integration, and enterprise solutions. I bridge the gap between modern web/mobile 
                technologies and legacy enterprise systems.
              </p>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Technical Expertise</h2>
              </div>
              
              <Tabs defaultValue="mobile" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                  <TabsTrigger value="mobile" className="flex items-center gap-2">
                    <Mobile className="h-4 w-4" />
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger value="frontend" className="flex items-center gap-2">
                    <Web className="h-4 w-4" />
                    Frontend
                  </TabsTrigger>
                  <TabsTrigger value="backend" className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Backend
                  </TabsTrigger>
                  <TabsTrigger value="sap" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    SAP
                  </TabsTrigger>
                  <TabsTrigger value="devops" className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    DevOps
                  </TabsTrigger>
                </TabsList>
                
                {Object.entries(techSkills).map(([category, skills]) => (
                  <TabsContent key={category} value={category.toLowerCase().split(' ')[0]}>
                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Featured Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Layers className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">Featured Projects</h2>
                </div>
                <Button variant="outline" asChild>
                  <a href="https://chandan-mondal.vercel.app/">View Portfolio</a>
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">{project.category}</Badge>
                        <span className="text-sm text-muted-foreground">{project.year}</span>
                      </div>
                      <CardTitle className="text-lg mt-2">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* SAP & Enterprise Expertise */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-6 w-6 text-primary" />
                  <CardTitle>SAP & Enterprise Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">SAP Specializations</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>SAP ABAP Development & Customization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>OData Service Development & Integration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>SAP WMS Implementation & Support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>Fiori App Development</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Integration Experience</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>SAP to Mobile App Integration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Legacy System Modernization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>API Gateway Development</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Real-time Data Synchronization</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Videos */}
            {recentVideos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Video className="h-6 w-6 text-primary" />
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">Latest Tutorials</h2>
                      <p className="text-muted-foreground mt-1">Technical tutorials on React Native, SAP, and more</p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/videos">View All Videos</a>
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {recentVideos.map((video) => (
                    <Card key={video._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-video bg-muted overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-foreground line-clamp-2 mb-2">{video.title}</h3>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-muted-foreground">
                              {video.views?.toLocaleString()} views
                            </span>
                            <a
                              href={`/videos/${video._id}`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              Watch →
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Certifications</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{cert.name}</h3>
                          <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
                        </div>
                        <Award className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Creative Side */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <PenTool className="h-6 w-6 text-primary" />
                    <CardTitle>Poetry & Writing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Published poet with {stats.poemsWritten}+ poems exploring themes of technology, 
                    human experience, and modern life.
                  </p>
                  <Button className="w-full" asChild>
                    <a href="/poems">Read My Poems</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <CardTitle>Books & Publications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Author of technical books and creative publications blending programming 
                    concepts with literary expression.
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <a href="/books">Browse Books</a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Let&apos;s Build Something Amazing
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Need help with React Native apps, SAP integration, or full-stack development? 
                  I&apos;d love to discuss how I can contribute to your project.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" asChild>
                    <a href={`mailto:${settings.email || 'chandan@example.com'}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Start a Conversation
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://chandan-mondal.vercel.app/">View My Portfolio</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
