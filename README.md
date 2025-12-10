# Poetry & Books Blog Platform

A comprehensive Next.js application for managing and sharing poetry, books, and literary content with full e-commerce capabilities.

## Features

### Public Features
- **Poetry Management**: Browse, read, and discover poems with search functionality
- **Book Store**: Browse physical and e-books, view detailed information
- **E-commerce**: Shopping cart and checkout system
- **Community Features**: Reviews, comments (with replies), and reactions (like, love, inspire)
- **About Page**: Author bio with YouTube channel integration
- **SEO Optimized**: Proper metadata and structured content

### Admin Features
- **Complete Dashboard**: Overview of poems, books, orders, and reviews
- **Poem Management**: Create, edit, and delete poems with tags
- **Book Management**: Add books (both physical and e-books) with inventory tracking
- **Order Management**: View and track customer orders
- **Community Moderation**: Manage reviews and comments
- **Site Settings**: Customize author bio, images, and YouTube channel

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB
- **Authentication**: JWT with secure sessions
- **UI**: Tailwind CSS v4 with shadcn/ui components
- **Type Safety**: TypeScript

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MongoDB instance (local or cloud)

### 2. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=poem-blog
JWT_SECRET=your-super-secret-key-change-this
\`\`\`

### 3. Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Visit http://localhost:3000

### 4. First Admin Setup

1. Create an account at `/register`
2. Update the user in MongoDB to be admin:

\`\`\`javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
\`\`\`

3. Access admin dashboard at `/admin`

## Usage Guide

### For Readers
- Visit `/poems` to browse poems
- Visit `/books` to browse books
- Create an account to write reviews and comments
- Add books to cart and checkout at `/cart`

### For Admin
1. **Create Poem**: `/admin/poems/create`
   - Add title, content, excerpt, and tags
   
2. **Create Book**: `/admin/books/create`
   - Specify if physical, e-book, or both
   - Add pricing and stock information
   - Upload cover image and e-book file paths

3. **Site Settings**: `/admin/settings`
   - Update author bio and image
   - Add YouTube channel handle
   - Customize site name and description

4. **Manage Content**: `/admin`
   - View all poems, books, and orders
   - Edit or delete content
   - Moderate reviews and comments

## Database Schema

### Collections

- **users**: User accounts with auth credentials
- **poems**: Poetry content with metadata
- **books**: Book information (physical, digital, or both)
- **reviews**: User reviews for content
- **comments**: User comments with reply support
- **reactions**: User reactions (like, love, inspire)
- **cart**: Shopping cart items
- **orders**: Order history
- **settings**: Site configuration

## API Endpoints

### Public
- `GET /api/poems` - List all poems
- `GET /api/poems/[id]` - Get poem details
- `GET /api/books` - List all books
- `GET /api/books/[id]` - Get book details
- `GET /api/reviews` - Get reviews for content
- `GET /api/comments` - Get comments for content
- `GET /api/reactions` - Get reactions for content
- `GET /api/settings` - Get site settings

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Protected (Admin)
- `POST /api/poems` - Create poem
- `PUT /api/poems/[id]` - Update poem
- `DELETE /api/poems/[id]` - Delete poem
- `POST /api/books` - Create book
- `PUT /api/books/[id]` - Update book
- `DELETE /api/books/[id]` - Delete book

### User (Authenticated)
- `POST /api/reviews` - Submit review
- `POST /api/comments` - Add comment
- `POST /api/reactions` - Add reaction
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Set environment variables in Vercel project settings.

### Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use MongoDB Atlas (production-grade cloud database)
- [ ] Enable SSL/TLS for MongoDB connection
- [ ] Set NODE_ENV=production
- [ ] Configure CORS if needed
- [ ] Set up backup strategy for MongoDB
- [ ] Enable rate limiting for API routes

## Customization

### Add More Reaction Types
Edit `lib/types.ts` and add to the `Reaction` interface, then update `ReactionsBar` component.

### Customize Email Templates
Integrate with email service (SendGrid, Resend) in `app/api/orders/route.ts`

### Add Payment Gateway
Integrate Stripe in order creation for real payments.

### YouTube Integration
Replace placeholder videos with real YouTube API integration in `app/about/page.tsx`

## Support & Troubleshooting

### MongoDB Connection Issues
- Verify connection string includes credentials
- Check IP whitelist in MongoDB Atlas
- Ensure database name is correct

### JWT Authentication Failing
- Verify JWT_SECRET is set
- Check cookie settings in middleware
- Clear browser cookies and retry

### Admin Not Showing
- Verify user.isAdmin is true in MongoDB
- Clear cookies and login again

## License

This project is private and for personal use.

## Future Enhancements

- [ ] Email notifications for orders
- [ ] Advanced search with filters
- [ ] Reading time estimation for poems
- [ ] Social sharing features
- [ ] Newsletter subscription
- [ ] Multiple language support
- [ ] Dark/Light theme switcher
- [ ] Analytics dashboard
- [ ] Author collaboration features
- [ ] Payment processing integration
