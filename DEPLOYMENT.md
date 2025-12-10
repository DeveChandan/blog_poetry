# Deployment Guide

## Vercel Deployment

### Step 1: Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/poem-blog.git
git push -u origin main
\`\`\`

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy"

### Step 3: Set Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add:
   - `MONGODB_URI`: Your MongoDB connection string
   - `MONGODB_DB_NAME`: poem-blog
   - `JWT_SECRET`: A strong random string (generate: `openssl rand -hex 32`)
   - `NODE_ENV`: production

### Step 4: Custom Domain (Optional)
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## MongoDB Setup for Production

### Using MongoDB Atlas

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**:
   - Select M0 (free tier) or higher
   - Choose region closest to users
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to Security → Database Access
   - Click "Add New User"
   - Set username and password
   - Add role: "Atlas admin"

4. **Get Connection String**:
   - Go to Deployment → Databases
   - Click "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Replace `<username>:<password>` with your credentials

5. **Add IP to Whitelist**:
   - Go to Security → Network Access
   - Click "Add IP Address"
   - Add 0.0.0.0/0 (allows all) or specific IPs

### Connection String Format
\`\`\`
mongodb+srv://username:password@cluster.mongodb.net/poem-blog?retryWrites=true&w=majority
\`\`\`

## Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use MongoDB Atlas (not local)
- [ ] Enable IP whitelisting in MongoDB
- [ ] Set NODE_ENV=production
- [ ] Enable SSL/TLS for all connections
- [ ] Regular database backups
- [ ] Monitor failed login attempts
- [ ] Use environment variables (not hardcoded values)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Regularly update dependencies

## Performance Optimization

### Database Optimization
- Add indexes to frequently queried fields
- Archive old orders and comments
- Use pagination for large datasets

### Image Optimization
- Use WebP format where possible
- Compress book covers and author images
- Lazy load images on list pages

### Caching Strategy
- Enable Next.js image optimization
- Cache static assets
- Consider Redis for session storage

## Monitoring & Analytics

### Vercel Analytics
- Dashboard shows real-time metrics
- Performance insights
- Error tracking

### MongoDB Monitoring
- Use MongoDB Atlas charts
- Track query performance
- Monitor storage usage

## Backup Strategy

### Automated Backups
- MongoDB Atlas provides automatic backups
- Free plan: 7-day retention
- Paid plans: 30-day retention

### Manual Backups
\`\`\`bash
# Export data
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/poem-blog"

# Import data
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/poem-blog" ./dump/poem-blog
\`\`\`

## Troubleshooting Production Issues

### High Response Times
1. Check MongoDB indexes
2. Enable query profiling
3. Review API route performance

### Memory Issues
- Clear old sessions/carts
- Archive completed orders
- Optimize large queries

### Connection Timeouts
- Check MongoDB whitelist
- Verify connection string
- Review network settings

### Out of Memory Errors
- Reduce dataset size in queries
- Implement pagination
- Add connection pooling

## SSL/TLS Certificate

Vercel automatically provisions SSL certificates:
- Auto-renewal enabled
- Free for all projects
- Covers primary domain and \*.domain.com

## Cost Estimation

### Free Tier
- Vercel: Free (up to 100 GB bandwidth/month)
- MongoDB Atlas: Free (512 MB storage)
- Total: $0/month

### Production Tier
- Vercel: $20/month (Pro)
- MongoDB Atlas: $57/month (M2 with backup)
- Domain: $10-15/year
- Total: ~$77/month

## Support & Incident Response

### Monitoring Alerts
Set up Vercel alerts for:
- Build failures
- Deployment errors
- High error rates

### Incident Response Plan
1. Check Vercel status dashboard
2. Review MongoDB logs
3. Check application error logs
4. Rollback if necessary

## Next Steps After Deployment

1. Test all features in production
2. Set up monitoring and alerts
3. Create backup schedule
4. Monitor performance metrics
5. Plan scaling strategy
