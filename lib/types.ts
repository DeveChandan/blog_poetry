export interface User {
  _id?: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Poem {
  _id?: string
  title: string
  content: string
  excerpt: string
  author: string
  tags: string[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
  views: number
}

export interface Book {
  _id?: string
  title: string
  description: string
  author: string
  isbn: string
  cover: string
  price: number
  type: "physical" | "ebook" | "both"
  filePath?: string
  stock?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: string
  contentId: string
  contentType: "poem" | "book"
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id?: string
  contentId: string
  contentType: "poem" | "book"
  userId: string
  userName: string
  comment: string
  replies: Reply[]
  createdAt: Date
  updatedAt: Date
}

export interface Reply {
  _id: string
  userId: string
  userName: string
  comment: string
  createdAt: Date
}

export interface Reaction {
  _id?: string
  contentId: string
  contentType: "poem" | "book"
  userId: string
  type: "like" | "love" | "inspire"
  createdAt: Date
}

export interface CartItem {
  bookId: string
  quantity: number
  price: number
}

export interface Order {
  _id?: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "completed" | "cancelled"
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface AdminSettings {
  _id?: string
  siteName: string
  siteDescription: string
  authorBio: string
  authorImage: string
  youtubeChannel?: string
}

export interface Video {
  _id?: string
  title: string
  description: string
  youtubeId: string
  thumbnail: string
  views: number
  createdAt: Date
  updatedAt: Date
}
