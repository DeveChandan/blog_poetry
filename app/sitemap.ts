import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db';

// IMPORTANT: Change this to your actual domain
const URL = 'https://blog-poetry.vercel.app/';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await connectDB();

  const poems = await db.collection('poems').find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray();
  const books = await db.collection('books').find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray();
  const videos = await db.collection('videos').find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray();

  const poemUrls = poems.map(poem => ({
    url: `${URL}/poems/${poem._id}`,
    lastModified: poem.updatedAt || new Date(),
  }));

  const bookUrls = books.map(book => ({
    url: `${URL}/books/${book._id}`,
    lastModified: book.updatedAt || new Date(),
  }));

  const videoUrls = videos.map(video => ({
    url: `${URL}/videos/${video._id}`,
    lastModified: video.updatedAt || new Date(),
  }));

  const staticUrls = [
    { url: URL, lastModified: new Date() },
    { url: `${URL}/about`, lastModified: new Date() },
    { url: `${URL}/poems`, lastModified: new Date() },
    { url: `${URL}/books`, lastModified: new Date() },
    { url: `${URL}/videos`, lastModified: new Date() },
    { url: `${URL}/login`, lastModified: new Date() },
    { url: `${URL}/register`, lastModified: new Date() },
  ];

  return [
    ...staticUrls,
    ...poemUrls,
    ...bookUrls,
    ...videoUrls,
  ];
}
