# Quick Start Guide

## Step 1: Database Setup

### Using MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Create a database user
4. Get connection string
5. Add to `.env.local`

### Using Local MongoDB
1. Install MongoDB locally
2. Use: `mongodb://localhost:27017`
3. Create database: `poem-blog`

## Step 2: Environment Variables

Create `.env.local`:
\`\`\`
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGODB_DB_NAME=poem-blog
JWT_SECRET=change-this-to-random-string
\`\`\`

## Step 3: Install & Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Step 4: Create Admin Account

1. Register at http://localhost:3000/register
2. Connect to MongoDB and run:
\`\`\`javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
\`\`\`
3. Login and go to /admin

## Step 5: Add Content

1. Create poems at /admin/poems/create
2. Add books at /admin/books/create
3. Configure settings at /admin/settings

## File Structure

\`\`\`
.
├── app/
│   ├── api/                 # API routes
│   ├── admin/              # Admin pages
│   ├── poems/              # Poem pages
│   ├── books/              # Book pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout
│   ├── login/              # Auth pages
│   ├── register/
│   ├── about/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/             # Reusable components
│   └── ui/                # shadcn components
├── lib/
│   ├── db.ts              # Database connection
│   ├── auth.ts            # Auth utilities
│   ├── types.ts           # TypeScript types
│   ├── session.ts         # Session management
│   └── utils.ts
├── middleware.ts          # Auth middleware
└── .env.local
\`\`\`

## Troubleshooting

### "MONGODB_URI is not set"
- Make sure `.env.local` exists
- Verify variable name is correct
- Restart dev server after updating .env

### "Cannot connect to MongoDB"
- Test connection string in MongoDB Compass
- Check IP whitelist (MongoDB Atlas)
- Verify database user has permissions

### Admin panel not accessible
- User must have isAdmin: true in database
- Check browser cookies are enabled
- Clear cookies and login again

### 404 errors on API routes
- Verify file paths use correct naming
- Check middleware.ts for route protection
- API files should be in app/api directory

## Next Steps

1. Customize About page content
2. Add your poems and books
3. Configure admin settings
4. Deploy to Vercel
5. Set up production MongoDB
\`\`\`

```json file="" isHidden
