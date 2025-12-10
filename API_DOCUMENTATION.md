# API Documentation

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication

### Register
\`\`\`
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 201 Created
{
  "message": "User created successfully",
  "userId": "user_id"
}
\`\`\`

### Login
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "message": "Login successful",
  "isAdmin": false
}
\`\`\`

### Logout
\`\`\`
POST /auth/logout

Response: 200 OK
{
  "message": "Logged out successfully"
}
\`\`\`

## Poems

### List All Poems
\`\`\`
GET /poems

Response: 200 OK
[
  {
    "_id": "poem_id",
    "title": "Poem Title",
    "content": "Poem content...",
    "excerpt": "Short excerpt",
    "tags": ["nature", "love"],
    "views": 150,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

### Get Poem Details
\`\`\`
GET /poems/:id

Response: 200 OK
{
  "_id": "poem_id",
  "title": "Poem Title",
  "content": "Poem content...",
  ...
}
\`\`\`

### Create Poem (Admin)
\`\`\`
POST /poems
Authorization: Bearer token
Content-Type: application/json

{
  "title": "New Poem",
  "content": "Poem content...",
  "excerpt": "Short excerpt",
  "tags": ["nature", "love"]
}

Response: 201 Created
{
  "message": "Poem created",
  "id": "poem_id"
}
\`\`\`

### Update Poem (Admin)
\`\`\`
PUT /poems/:id
Authorization: Bearer token
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "excerpt": "Updated excerpt",
  "tags": ["nature"]
}

Response: 200 OK
{
  "message": "Poem updated"
}
\`\`\`

### Delete Poem (Admin)
\`\`\`
DELETE /poems/:id
Authorization: Bearer token

Response: 200 OK
{
  "message": "Poem deleted"
}
\`\`\`

## Books

### List All Books
\`\`\`
GET /books

Response: 200 OK
[
  {
    "_id": "book_id",
    "title": "Book Title",
    "description": "Book description",
    "price": 19.99,
    "type": "both",
    "cover": "image_url",
    "tags": ["fiction"]
  }
]
\`\`\`

### Get Book Details
\`\`\`
GET /books/:id

Response: 200 OK
{
  "_id": "book_id",
  "title": "Book Title",
  ...
}
\`\`\`

### Create Book (Admin)
\`\`\`
POST /books
Authorization: Bearer token
Content-Type: application/json

{
  "title": "New Book",
  "description": "Book description",
  "isbn": "978-3-16-148410-0",
  "price": 29.99,
  "type": "both",
  "cover": "image_url",
  "filePath": "/books/ebook.pdf",
  "stock": 50,
  "tags": ["fiction", "bestseller"]
}

Response: 201 Created
{
  "message": "Book created",
  "id": "book_id"
}
\`\`\`

## Reviews

### Get Reviews for Content
\`\`\`
GET /reviews?contentId=id&contentType=poem

Response: 200 OK
[
  {
    "_id": "review_id",
    "rating": 5,
    "comment": "Amazing poem!",
    "userName": "User",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

### Create Review
\`\`\`
POST /reviews
Authorization: Bearer token
Content-Type: application/json

{
  "contentId": "poem_id",
  "contentType": "poem",
  "rating": 5,
  "comment": "Amazing poem!"
}

Response: 201 Created
{
  "message": "Review created",
  "id": "review_id"
}
\`\`\`

## Comments

### Get Comments for Content
\`\`\`
GET /comments?contentId=id&contentType=poem

Response: 200 OK
[
  {
    "_id": "comment_id",
    "comment": "Great work!",
    "userName": "User",
    "replies": [],
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

### Create Comment
\`\`\`
POST /comments
Authorization: Bearer token
Content-Type: application/json

{
  "contentId": "poem_id",
  "contentType": "poem",
  "comment": "Great work!"
}

Response: 201 Created
{
  "message": "Comment created",
  "id": "comment_id"
}
\`\`\`

## Reactions

### Get Reactions for Content
\`\`\`
GET /reactions?contentId=id&contentType=poem

Response: 200 OK
[
  {
    "_id": "reaction_id",
    "type": "like",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

### Add Reaction
\`\`\`
POST /reactions
Authorization: Bearer token
Content-Type: application/json

{
  "contentId": "poem_id",
  "contentType": "poem",
  "type": "like"
}

Response: 201 Created
{
  "message": "Reaction created",
  "id": "reaction_id"
}
\`\`\`

## Cart

### Get Cart Items
\`\`\`
GET /cart
Authorization: Bearer token

Response: 200 OK
[
  {
    "bookId": "book_id",
    "quantity": 2,
    "price": 19.99
  }
]
\`\`\`

### Add to Cart
\`\`\`
POST /cart
Authorization: Bearer token
Content-Type: application/json

{
  "bookId": "book_id",
  "quantity": 1,
  "price": 19.99
}

Response: 200 OK
{
  "message": "Item added to cart"
}
\`\`\`

## Orders

### Get User Orders
\`\`\`
GET /orders
Authorization: Bearer token

Response: 200 OK
[
  {
    "_id": "order_id",
    "items": [...],
    "totalAmount": 49.98,
    "status": "pending",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

### Create Order
\`\`\`
POST /orders
Authorization: Bearer token
Content-Type: application/json

{
  "items": [
    {
      "bookId": "book_id",
      "quantity": 1,
      "price": 19.99
    }
  ],
  "email": "user@example.com"
}

Response: 201 Created
{
  "message": "Order created",
  "orderId": "order_id"
}
\`\`\`

## Settings

### Get Site Settings
\`\`\`
GET /settings

Response: 200 OK
{
  "siteName": "Poetry Blog",
  "authorBio": "Bio text...",
  "authorImage": "image_url",
  "youtubeChannel": "@channel"
}
\`\`\`

### Update Settings (Admin)
\`\`\`
POST /settings
Authorization: Bearer token
Content-Type: application/json

{
  "siteName": "My Poetry",
  "siteDescription": "Description",
  "authorBio": "About me...",
  "authorImage": "image_url",
  "youtubeChannel": "@mychannel"
}

Response: 200 OK
{
  "message": "Settings updated"
}
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Missing required fields"
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "Unauthorized"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Resource not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`
