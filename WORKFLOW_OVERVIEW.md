# Poem Blog & E-Commerce Platform - Complete Workflow Overview

## Architecture Overview

This is a full-stack Next.js application with MongoDB backend implementing a complete blog and e-commerce system for poems and books.

---

## User Flow Diagram

### 1. PUBLIC USER FLOW (No Authentication Required)

\`\`\`
Home Page (/)
    ├─ Browse Poems (/poems)
    │   ├─ Search & Filter by Tags
    │   └─ View Poem Details (/poems/[id])
    │       ├─ Read Full Content
    │       ├─ View Reactions (Like, Love, Inspire)
    │       ├─ Read Reviews & Ratings
    │       └─ Read Comments with Replies
    │
    ├─ Browse Books (/books)
    │   ├─ Search Books
    │   ├─ Filter by Type (Physical/E-book/Both)
    │   └─ View Book Details (/books/[id])
    │       ├─ Read Description
    │       ├─ Download E-book (if available)
    │       ├─ View Reactions
    │       ├─ Read Reviews
    │       └─ Read Comments
    │
    ├─ About Author (/about)
    │   ├─ Author Bio
    │   ├─ YouTube Videos
    │   └─ Contact Information
    │
    └─ Authentication
        ├─ Register (/register) → Create Account
        └─ Login (/login) → User Credentials
\`\`\`

### 2. AUTHENTICATED USER FLOW (Regular Users - isAdmin: false)

\`\`\`
After Login:
    ├─ All Public Access + Enhanced Features
    │   ├─ Create/Edit Personal Profile
    │   ├─ Write Reviews & Ratings
    │   │   └─ POST /api/reviews
    │   ├─ Write Comments with Replies
    │   │   └─ POST /api/comments
    │   │   └─ POST /api/comments/[id] (reply)
    │   └─ React to Content (Like, Love, Inspire)
    │       └─ POST /api/reactions
    │
    └─ E-Commerce Features
        ├─ Add Books to Cart
        │   └─ POST /api/cart
        ├─ View & Manage Cart (/cart)
        │   └─ GET /api/cart
        ├─ Checkout Process
        │   ├─ Enter Email
        │   └─ Create Order
        │       └─ POST /api/orders
        └─ View Order Confirmation (/checkout/success)
\`\`\`

### 3. ADMIN USER FLOW (isAdmin: true - Protected Routes)

#### Access Control:
- **Middleware** checks `/admin/*` routes
- Verifies token exists & JWT is valid
- Confirms user `isAdmin === true`
- Redirects unauthorized users to `/` or `/login`

#### Admin Dashboard (/admin) - Statistics & Navigation:
\`\`\`
Admin Dashboard
    ├─ View Statistics
    │   ├─ Total Poems
    │   ├─ Total Books
    │   ├─ Total Orders
    │   └─ Total Reviews
    │
    ├─ Content Management
    │   ├─ Manage Poems (/admin/poems)
    │   │   ├─ List all poems with actions
    │   │   ├─ Edit Poem (/admin/poems/[id]/edit)
    │   │   │   └─ PUT /api/poems/[id]
    │   │   ├─ Delete Poem
    │   │   │   └─ DELETE /api/poems/[id]
    │   │   └─ Create New Poem (/admin/poems/create)
    │   │       └─ POST /api/poems
    │   │
    │   └─ Manage Books (/admin/books)
    │       ├─ List all books with actions
    │       ├─ Edit Book (/admin/books/[id]/edit)
    │       │   └─ PUT /api/books/[id]
    │       ├─ Delete Book
    │       │   └─ DELETE /api/books/[id]
    │       └─ Create New Book (/admin/books/create)
    │           └─ POST /api/books (with file upload)
    │
    ├─ Orders Management (/admin/orders)
    │   ├─ View all orders
    │   ├─ Track order status (pending/completed/cancelled)
    │   └─ Update order status
    │
    ├─ Community Moderation
    │   ├─ Manage Reviews (/admin/reviews)
    │   │   ├─ View all reviews
    │   │   ├─ Delete inappropriate reviews
    │   │   │   └─ DELETE /api/reviews/[id]
    │   │   └─ Filter by rating/content
    │   │
    │   └─ Manage Comments (/admin/comments)
    │       ├─ View all comments
    │       ├─ Delete inappropriate comments
    │       │   └─ DELETE /api/comments/[id]
    │       └─ Filter by content type
    │
    └─ Settings (/admin/settings)
        ├─ Site Configuration
        │   ├─ Site Name
        │   ├─ Site Description
        │   └─ Author Bio
        ├─ Author Profile
        │   ├─ Profile Image
        │   └─ YouTube Channel URL
        └─ Save Settings
            └─ PUT /api/settings
\`\`\`

---

## API Endpoints Reference

### Authentication APIs
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/api/auth/register` | Create new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/verify` | Verify admin status | ✅ |

### Content APIs
| Method | Endpoint | Purpose | Auth | Admin |
|--------|----------|---------|------|-------|
| GET | `/api/poems` | List all poems | ❌ | ❌ |
| GET | `/api/poems/[id]` | Get poem details | ❌ | ❌ |
| POST | `/api/poems` | Create poem | ✅ | ✅ |
| PUT | `/api/poems/[id]` | Update poem | ✅ | ✅ |
| DELETE | `/api/poems/[id]` | Delete poem | ✅ | ✅ |
| GET | `/api/books` | List all books | ❌ | ❌ |
| GET | `/api/books/[id]` | Get book details | ❌ | ❌ |
| POST | `/api/books` | Create book | ✅ | ✅ |
| PUT | `/api/books/[id]` | Update book | ✅ | ✅ |
| DELETE | `/api/books/[id]` | Delete book | ✅ | ✅ |

### Community APIs
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/reviews` | Get reviews | ❌ |
| POST | `/api/reviews` | Create review | ✅ |
| DELETE | `/api/reviews/[id]` | Delete review (admin/owner) | ✅ |
| GET | `/api/comments` | Get comments | ❌ |
| POST | `/api/comments` | Create comment | ✅ |
| POST | `/api/comments/[id]` | Reply to comment | ✅ |
| DELETE | `/api/comments/[id]` | Delete comment (admin/owner) | ✅ |
| POST | `/api/reactions` | Add reaction | ✅ |

### E-Commerce APIs
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/cart` | Get cart items | ✅ |
| POST | `/api/cart` | Add to cart | ✅ |
| DELETE | `/api/cart` | Remove from cart | ✅ |
| GET | `/api/orders` | Get orders | ✅ (filtered by user) |
| POST | `/api/orders` | Create order | ✅ |

### Settings API
| Method | Endpoint | Purpose | Auth | Admin |
|--------|----------|---------|------|-------|
| GET | `/api/settings` | Get site settings | ❌ | ❌ |
| PUT | `/api/settings` | Update settings | ✅ | ✅ |

---

## Data Models

### User
\`\`\`typescript
{
  _id: ObjectId
  email: string (unique)
  password: string (hashed with bcrypt)
  name: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Poem
\`\`\`typescript
{
  _id: ObjectId
  title: string
  content: string
  excerpt: string
  author: string
  tags: string[]
  featured: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Book
\`\`\`typescript
{
  _id: ObjectId
  title: string
  description: string
  author: string
  isbn: string
  cover: string (URL)
  price: number
  type: "physical" | "ebook" | "both"
  filePath?: string (for ebook)
  stock?: number (for physical)
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Review
\`\`\`typescript
{
  _id: ObjectId
  contentId: string (poem or book ID)
  contentType: "poem" | "book"
  userId: string
  userName: string
  rating: number (1-5)
  comment: string
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Comment
\`\`\`typescript
{
  _id: ObjectId
  contentId: string (poem or book ID)
  contentType: "poem" | "book"
  userId: string
  userName: string
  comment: string
  replies: [
    {
      _id: ObjectId
      userId: string
      userName: string
      comment: string
      createdAt: Date
    }
  ]
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Order
\`\`\`typescript
{
  _id: ObjectId
  userId: string
  items: [
    {
      bookId: string
      quantity: number
      price: number
    }
  ]
  totalAmount: number
  status: "pending" | "completed" | "cancelled"
  email: string
  createdAt: Date
  updatedAt: Date
}
\`\`\`

---

## Security Layers

### 1. Authentication
- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Session management in `/lib/session.ts`

### 2. Authorization
- **Middleware** (`middleware.ts`) protects `/admin/*` routes
- Verifies both token validity AND admin status
- Returns 401 for unauthenticated, 403 for unauthorized

### 3. API Endpoint Protection
- All admin operations require `isAdmin: true`
- Users can only edit/delete their own reviews/comments
- Orders filtered by user ID for non-admins

### 4. Admin Guard Component
- Client-side verification in `AdminGuard` component
- Double-checks admin status on page load
- Prevents flash of unauthorized content

---

## File Structure

\`\`\`
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx (home)
│   │   ├── poems/ (poem listing & details)
│   │   ├── books/ (book listing & details)
│   │   ├── about/
│   │   ├── login/
│   │   ├── register/
│   │   └── cart/
│   ├── admin/ (all protected with middleware & AdminGuard)
│   │   ├── page.tsx (dashboard)
│   │   ├── poems/ (CRUD poems)
│   │   ├── books/ (CRUD books)
│   │   ├── orders/ (view orders)
│   │   ├── reviews/ (moderate reviews)
│   │   ├── comments/ (moderate comments)
│   │   ├── settings/ (site config)
│   │   └── logout/
│   ├── api/
│   │   ├── auth/ (register, login, logout, verify)
│   │   ├── poems/ (CRUD + GET all)
│   │   ├── books/ (CRUD + GET all)
│   │   ├── reviews/ (CRUD)
│   │   ├── comments/ (CRUD with replies)
│   │   ├── reactions/ (create)
│   │   ├── cart/ (CRUD)
│   │   ├── orders/ (CRUD)
│   │   └── settings/ (CRUD)
│   ├── layout.tsx (root layout)
│   └── globals.css
├── lib/
│   ├── auth.ts (hashing, JWT utilities)
│   ├── session.ts (session management)
│   ├── db.ts (MongoDB connection)
│   ├── types.ts (TypeScript interfaces)
│   ├── api-client.ts (fetch utilities)
│   └── utils.ts
├── components/
│   ├── navigation.tsx
│   ├── admin-guard.tsx (client-side auth check)
│   ├── poem-card.tsx
│   ├── book-card.tsx
│   ├── reviews-section.tsx
│   ├── comments-section.tsx
│   ├── reactions-bar.tsx
│   └── ui/ (shadcn components)
├── middleware.ts (route protection)
├── next.config.mjs
├── tsconfig.json
└── package.json
\`\`\`

---

## Key Features Implemented

✅ SEO Optimized Poetry Blog
✅ Book Store with E-books & Physical Books
✅ Full E-Commerce (Cart, Checkout, Orders)
✅ Community Features (Reviews, Comments with Replies, Reactions)
✅ Complete Admin Dashboard
✅ Content Management System
✅ Order Management
✅ Community Moderation
✅ Secure Authentication & Authorization
✅ Responsive Design (Mobile, Tablet, Desktop)
✅ YouTube Integration Support
✅ Site Customization Settings

---

## Security Compliance

✅ HTTP-only Cookie Storage for Tokens
✅ Password Hashing with Bcrypt
✅ JWT Validation on Protected Routes
✅ Admin-Only Endpoint Protection
✅ Client-Side & Server-Side Auth Checks
✅ CORS Ready Configuration
✅ Input Validation on All APIs
✅ Proper HTTP Status Codes (401, 403, 200, etc.)

---

## Next Steps / Future Enhancements

- [ ] Payment Gateway Integration (Stripe)
- [ ] Email Notifications
- [ ] Advanced Analytics
- [ ] Search Optimization (Elasticsearch/Algolia)
- [ ] Image Optimization & CDN
- [ ] Caching Strategy (Redis)
- [ ] Rate Limiting on APIs
- [ ] User Notifications System
- [ ] Advanced Filtering Options
- [ ] Mobile App Version
