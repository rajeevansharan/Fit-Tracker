"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Play } from "lucide-react"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
}

interface Workout {
  id: string
  name: string
  exercises: Exercise[]
}

export function WorkoutBuilder() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Push Day",
      exercises: [
        { id: "1", name: "Bench Press", sets: 4, reps: 8, weight: 185 },
        { id: "2", name: "Shoulder Press", sets: 3, reps: 10, weight: 135 },
        { id: "3", name: "Tricep Dips", sets: 3, reps: 12, weight: 0 },
      ],
    },
  ])

  const [newWorkoutName, setNewWorkoutName] = useState("")
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: 3,
    reps: 10,
    weight: 0,
  })

  const createWorkout = () => {
    if (!newWorkoutName.trim()) return

    const workout: Workout = {
      id: Date.now().toString(),
      name: newWorkoutName,
      exercises: [],
    }

    setWorkouts([...workouts, workout])
    setNewWorkoutName("")
    setSelectedWorkout(workout.id)
  }

  const addExercise = () => {
    if (!selectedWorkout || !newExercise.name.trim()) return

    const exercise: Exercise = {
      id: Date.now().toString(),
      ...newExercise,
    }

    setWorkouts(
      workouts.map((workout) =>
        workout.id === selectedWorkout ? { ...workout, exercises: [...workout.exercises, exercise] } : workout,
      ),
    )

    setNewExercise({ name: "", sets: 3, reps: 10, weight: 0 })
  }

  const removeExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(
      workouts.map((workout) =>
        workout.id === workoutId
          ? { ...workout, exercises: workout.exercises.filter((ex) => ex.id !== exerciseId) }
          : workout,
      ),
    )
  }

  const selectedWorkoutData = workouts.find((w) => w.id === selectedWorkout)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Workout Builder</h2>
          <p className="text-muted-foreground text-pretty">Create and customize your perfect workout routines</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workout List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Workouts</CardTitle>
            <CardDescription>Select a workout to edit or create a new one</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">New Workout Name</Label>
              <div className="flex gap-2">
                <Input
                  id="workout-name"
                  placeholder="e.g., Push Day"
                  value={newWorkoutName}
                  onChange={(e) => setNewWorkoutName(e.target.value)}
                />
                <Button onClick={createWorkout} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedWorkout === workout.id
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:bg-accent"
                  }`}
                  onClick={() => setSelectedWorkout(workout.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{workout.name}</h3>
                    <Badge variant="secondary">{workout.exercises.length} exercises</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Add Exercise</CardTitle>
            <CardDescription>Add exercises to your selected workout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedWorkout ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input
                    id="exercise-name"
                    placeholder="e.g., Bench Press"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({ ...newExercise, weight: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <Button onClick={addExercise} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">Select a workout to add exercises</p>
            )}
          </CardContent>
        </Card>

        {/* Workout Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Workout Preview</CardTitle>
            <CardDescription>Review your workout before starting</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedWorkoutData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedWorkoutData.name}</h3>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectedWorkoutData.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(selectedWorkoutData.id, exercise.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {selectedWorkoutData.exercises.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No exercises added yet</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Select a workout to preview</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
