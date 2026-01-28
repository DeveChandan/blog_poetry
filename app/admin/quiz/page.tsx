"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, HelpCircle } from "lucide-react"

interface QuizQuestion {
    _id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    category: string
    difficulty: string
}

export default function AdminQuizPage() {
    return (
        <AdminGuard>
            <AdminQuizContent />
        </AdminGuard>
    )
}

function AdminQuizContent() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const initialFormState = {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: 0,
        explanation: "",
        category: "General",
        difficulty: "medium",
    }

    const [formData, setFormData] = useState(initialFormState)

    const fetchQuestions = async () => {
        try {
            const res = await fetch("/api/quiz")
            if (res.ok) {
                const data = await res.json()
                setQuestions(data)
            }
        } catch (error) {
            console.error("Failed to fetch questions:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingId ? `/api/quiz/${editingId}` : "/api/quiz"
            const method = editingId ? "PUT" : "POST"

            const payload = {
                question: formData.question,
                options: [formData.option1, formData.option2, formData.option3, formData.option4],
                correctAnswer: Number(formData.correctAnswer),
                explanation: formData.explanation,
                category: formData.category,
                difficulty: formData.difficulty,
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                toast.success(editingId ? "Question updated!" : "Question created!")
                setFormData(initialFormState)
                setShowForm(false)
                setEditingId(null)
                fetchQuestions()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to save question")
            }
        } catch (error) {
            toast.error("Failed to save question")
        }
    }

    const handleEdit = (q: QuizQuestion) => {
        setFormData({
            question: q.question,
            option1: q.options[0] || "",
            option2: q.options[1] || "",
            option3: q.options[2] || "",
            option4: q.options[3] || "",
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
            category: q.category || "General",
            difficulty: q.difficulty || "medium",
        })
        setEditingId(q._id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return

        try {
            const res = await fetch(`/api/quiz/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Question deleted!")
                fetchQuestions()
            } else {
                toast.error("Failed to delete question")
            }
        } catch (error) {
            toast.error("Failed to delete question")
        }
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manage Quiz</h1>
                        <p className="text-muted-foreground">Add and manage quiz questions</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin">← Back to Dashboard</Link>
                        </Button>
                        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                        </Button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Question" : "Add New Question"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Question *</label>
                                    <Input
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        placeholder="Enter question"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((num) => (
                                        <div key={num}>
                                            <label className="block text-sm font-medium mb-2">Option {num} *</label>
                                            <Input
                                                value={formData[`option${num}` as keyof typeof formData] as string}
                                                onChange={(e) => setFormData({ ...formData, [`option${num}`]: e.target.value })}
                                                placeholder={`Option ${num}`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Correct Answer</label>
                                        <select
                                            value={formData.correctAnswer}
                                            onChange={(e) => setFormData({ ...formData, correctAnswer: Number(e.target.value) })}
                                            className="w-full px-3 py-2 rounded-md border bg-background"
                                        >
                                            <option value={0}>Option 1</option>
                                            <option value={1}>Option 2</option>
                                            <option value={2}>Option 3</option>
                                            <option value={3}>Option 4</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <Input
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="Literature, Grammar, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border bg-background"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
                                    <Textarea
                                        value={formData.explanation}
                                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                        placeholder="Explain why the answer is correct..."
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit">{editingId ? "Update Question" : "Add Question"}</Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((q) => (
                        <Card key={q._id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-lg">{q.question}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${q.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                q.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Correct: <span className="text-green-600 font-medium">{q.options[q.correctAnswer]}</span>
                                        <span className="mx-2">•</span>
                                        Category: {q.category}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(q)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(q._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {questions.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No questions yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </main>
    )
}
