"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    HelpCircle,
    CheckCircle,
    XCircle,
    RotateCcw,
    Trophy,
    ArrowRight,
    Lightbulb
} from "lucide-react"

interface QuizQuestion {
    _id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    category: string
    difficulty: string
}

export default function QuizPage() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        async function fetchQuiz() {
            try {
                const res = await fetch('/api/quiz')
                if (res.ok) {
                    const data = await res.json()
                    // Shuffle and take first 10 questions
                    const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 10)
                    setQuestions(shuffled)
                }
            } catch (error) {
                console.error("Failed to fetch quiz:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchQuiz()
    }, [])

    const handleAnswer = (index: number) => {
        if (isAnswered) return

        setSelectedAnswer(index)
        setIsAnswered(true)

        const isCorrect = index === questions[currentIndex].correctAnswer
        if (isCorrect) {
            setScore(prev => prev + 1)
        }
    }

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setIsAnswered(false)
        } else {
            setShowResults(true)
            if (score >= questions.length * 0.7) {
                // confetti call removed due to missing dependency
            }
        }
    }

    const restartQuiz = () => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setScore(0)
        setShowResults(false)
        // Reshuffle questions
        setQuestions(prev => [...prev].sort(() => Math.random() - 0.5))
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <HelpCircle className="h-12 w-12 text-primary animate-pulse" />
            </main>
        )
    }

    if (questions.length === 0) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-lg">No quiz questions available yet</p>
                    <p className="text-sm text-muted-foreground">Check back soon!</p>
                </div>
            </main>
        )
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100)

        return (
            <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="overflow-hidden">
                        <CardContent className="p-8 text-center">
                            <Trophy className={`h-16 w-16 mx-auto mb-6 ${percentage >= 70 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                            <p className="text-muted-foreground mb-6">You scored</p>
                            <div className="text-6xl font-bold text-primary mb-2">
                                {score}/{questions.length}
                            </div>
                            <p className="text-lg text-muted-foreground mb-8">
                                {percentage >= 90 ? "Outstanding! 🎉" :
                                    percentage >= 70 ? "Great job! 👏" :
                                        percentage >= 50 ? "Good effort! 💪" :
                                            "Keep practicing! 📚"}
                            </p>
                            <Button onClick={restartQuiz} size="lg" className="w-full">
                                <RotateCcw className="h-5 w-5 mr-2" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        )
    }

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Poetry Quiz</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        Test Your Knowledge
                    </h1>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="mb-6">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="outline">{currentQuestion.category}</Badge>
                                    <Badge variant={
                                        currentQuestion.difficulty === 'easy' ? 'secondary' :
                                            currentQuestion.difficulty === 'hard' ? 'destructive' : 'default'
                                    }>
                                        {currentQuestion.difficulty}
                                    </Badge>
                                </div>

                                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                                    {currentQuestion.question}
                                </h2>

                                {/* Options */}
                                <div className="space-y-3">
                                    {currentQuestion.options.map((option, index) => {
                                        const isSelected = selectedAnswer === index
                                        const isCorrect = index === currentQuestion.correctAnswer
                                        const showCorrect = isAnswered && isCorrect
                                        const showWrong = isAnswered && isSelected && !isCorrect

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswer(index)}
                                                disabled={isAnswered}
                                                className={`w-full p-4 rounded-lg border text-left transition-all ${showCorrect
                                                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                                                    : showWrong
                                                        ? 'bg-red-100 dark:bg-red-900/30 border-red-500'
                                                        : isSelected
                                                            ? 'bg-primary/10 border-primary'
                                                            : 'bg-card hover:bg-muted border-border'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{option}</span>
                                                    {showCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                                                    {showWrong && <XCircle className="h-5 w-5 text-red-500" />}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Explanation */}
                                {isAnswered && currentQuestion.explanation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-4 rounded-lg bg-muted/50 border"
                                    >
                                        <div className="flex items-start gap-2">
                                            <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                                            <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {/* Next Button */}
                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Button onClick={nextQuestion} size="lg" className="w-full">
                            {currentIndex < questions.length - 1 ? (
                                <>
                                    Next Question
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </>
                            ) : (
                                <>
                                    See Results
                                    <Trophy className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                )}
            </div>
        </main>
    )
}
