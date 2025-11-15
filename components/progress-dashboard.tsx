"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Calendar, Target, Zap } from "lucide-react"

const progressData = [
  { week: "Week 1", weight: 135, workouts: 3 },
  { week: "Week 2", weight: 140, workouts: 4 },
  { week: "Week 3", weight: 145, workouts: 3 },
  { week: "Week 4", weight: 150, workouts: 5 },
  { week: "Week 5", weight: 155, workouts: 4 },
  { week: "Week 6", weight: 160, workouts: 4 },
]

const exerciseData = [
  { exercise: "Bench Press", weight: 185 },
  { exercise: "Squat", weight: 225 },
  { exercise: "Deadlift", weight: 275 },
  { exercise: "Pull-ups", weight: 15 },
]

export function ProgressDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Your Progress Dashboard</h2>
          <p className="text-muted-foreground text-pretty">
            Track your fitness journey and celebrate your achievements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight Lifted</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450 lbs</div>
            <p className="text-xs text-muted-foreground">+850 lbs this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Records</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">New PRs this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strength Progress</CardTitle>
            <CardDescription>Your lifting progress over the past 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                weight: {
                  label: "Weight (lbs)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Max Lifts</CardTitle>
            <CardDescription>Your personal records for major exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                weight: {
                  label: "Weight (lbs)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exercise" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="weight" fill="var(--color-weight)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
