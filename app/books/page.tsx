import { connectDB } from "@/lib/db"
import FilteredBooks from "./filtered-books"

async function getBooks() {
  const db = await connectDB()
  const books = await db
    .collection("books")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          type: 1,
          cover: 1,
          isbn: 1,
          filePath: 1,
          stock: 1,
          tags: 1,
          createdAt: 1,
          author: "$authorDetails.name",
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray()

  return books.map((book) => ({
    ...book,
    _id: book._id.toString(),
    createdAt: book.createdAt?.toISOString(),
  }))
}

export default async function BooksPage() {
  const books = await getBooks()

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Books & E-books</h1>
        <FilteredBooks books={books} />
      </div>
    </main>
  )
}