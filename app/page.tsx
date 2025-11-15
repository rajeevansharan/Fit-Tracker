"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutBuilder } from "@/components/workout-builder"
import { ExerciseLibrary } from "@/components/exercise-library"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { WorkoutTimer } from "@/components/workout-timer"
import { ThemeToggle } from "@/components/theme-toggle"
import { Dumbbell, Target, TrendingUp, Timer } from "lucide-react"

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Dumbbell className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FitTracker Pro</h1>
                <p className="text-sm text-muted-foreground">Transform your fitness journey</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" size="sm"  className="hover:bg-primary hover:text-primary-foreground">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-14 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="workouts"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-primary-foreground"
            >
              <Target className="h-4 w-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger
              value="exercises"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-primary-foreground"
            >
              <Dumbbell className="h-4 w-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger
              value="timer"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-primary-foreground"
            >
              <Timer className="h-4 w-4" />
              Timer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ProgressDashboard />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutBuilder />
          </TabsContent>

          <TabsContent value="exercises">
            <ExerciseLibrary />
          </TabsContent>

          <TabsContent value="timer">
            <WorkoutTimer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
