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
  author: string // This should be string (user ID or name), not an object with Buffer
  tags: string[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
  views: number
}

// For database results with populated author
export interface PoemWithAuthor extends Omit<Poem, 'author'> {
  author: {
    _id: string
    name: string
    // If you have author image as Buffer in DB
    avatar?: Buffer
  }
}

// For client-side serialized data
export interface SerializedPoem {
  _id: string
  title: string
  content: string
  excerpt: string
  author: string // Keep as string ID
  tags: string[]
  featured: boolean
  createdAt: string // Date serialized to string
  updatedAt: string // Date serialized to string
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

// Add these helper types for serialization
export type Serializable<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}

export type WithStringId<T> = Omit<T, '_id'> & { _id: string }