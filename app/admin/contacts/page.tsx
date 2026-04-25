"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { AdminGuard } from "@/components/admin-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Mail } from "lucide-react"

interface ContactMessage {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export default function AdminContactsPage() {
  return (
    <AdminGuard>
      <AdminContactsContent />
    </AdminGuard>
  )
}

function AdminContactsContent() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/contact")
      if (!res.ok) throw new Error("Failed to fetch messages")
      const data = await res.json()
      setMessages(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            Contact Messages
          </h1>
          <p className="text-muted-foreground mt-2">
            View all messages submitted through the "Express your feelings" section on the home page.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages ({messages.length})</CardTitle>
            <CardDescription>Recent messages are shown first.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No messages found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((msg) => (
                      <TableRow key={msg._id}>
                        <TableCell className="whitespace-nowrap">
                          {msg.createdAt ? format(new Date(msg.createdAt), "MMM d, yyyy h:mm a") : "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">{msg.name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                            {msg.email}
                          </a>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
