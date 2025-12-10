"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

interface Exercise {
  id: string
  name: string
  category: string
  muscle: string
  equipment: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  instructions: string[]
}

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Bench Press",
    category: "Strength",
    muscle: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie flat on bench with feet firmly on ground",
      "Grip barbell with hands slightly wider than shoulder width",
      "Lower bar to chest with control",
      "Press bar up explosively to starting position",
    ],
  },
  {
    id: "2",
    name: "Squats",
    category: "Strength",
    muscle: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower body by bending knees and hips",
      "Keep chest up and knees tracking over toes",
      "Return to starting position by driving through heels",
    ],
  },
  {
    id: "3",
    name: "Pull-ups",
    category: "Strength",
    muscle: "Back",
    equipment: "Pull-up Bar",
    difficulty: "Advanced",
    instructions: [
      "Hang from pull-up bar with palms facing away",
      "Pull body up until chin clears the bar",
      "Lower body with control to starting position",
      "Repeat for desired reps",
    ],
  },
  {
    id: "4",
    name: "Push-ups",
    category: "Strength",
    muscle: "Chest",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start in plank position with hands under shoulders",
      "Lower body until chest nearly touches ground",
      "Push back up to starting position",
      "Keep core tight throughout movement",
    ],
  },
  {
    id: "5",
    name: "Deadlift",
    category: "Strength",
    muscle: "Back",
    equipment: "Barbell",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip bar",
      "Keep chest up and back straight",
      "Drive through heels to lift bar, extending hips and knees",
    ],
  },
  {
    id: "6",
    name: "Plank",
    category: "Core",
    muscle: "Core",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start in push-up position",
      "Lower to forearms, keeping body straight",
      "Hold position while breathing normally",
      "Keep core engaged throughout",
    ],
  },
]

export function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const categories = Array.from(new Set(exercises.map((ex) => ex.category)))

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Exercise Library</h2>
          <p className="text-muted-foreground text-pretty">Discover new exercises and perfect your form</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find the perfect exercise for your workout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle>Exercises ({filteredExercises.length})</CardTitle>
            <CardDescription>Click an exercise to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedExercise?.id === exercise.id
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:bg-accent"
                  }`}
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.muscle} • {exercise.equipment}
                      </p>
                    </div>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Details */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Details</CardTitle>
            <CardDescription>Learn proper form and technique</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedExercise ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedExercise.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedExercise.category}</Badge>
                    <Badge variant="outline">{selectedExercise.muscle}</Badge>
                    <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                      {selectedExercise.difficulty}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Equipment Needed</h4>
                  <p className="text-sm text-muted-foreground">{selectedExercise.equipment}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <ol className="space-y-2">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary font-medium">{index + 1}.</span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>

                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Workout
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Select an exercise to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
