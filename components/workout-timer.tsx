"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react"

export function WorkoutTimer() {
  const [minutes, setMinutes] = useState(2)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      // Play notification sound (browser notification)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Rest Timer Complete!", {
          body: "Time to get back to your workout!",
          icon: "/favicon.ico",
        })
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  const startTimer = () => {
    const total = minutes * 60 + seconds
    setTimeLeft(total)
    setTotalTime(total)
    setIsActive(true)

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }

  const pauseTimer = () => {
    setIsActive(false)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(0)
    setTotalTime(0)
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = time % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  const presetTimes = [
    { label: "30s", minutes: 0, seconds: 30 },
    { label: "1m", minutes: 1, seconds: 0 },
    { label: "2m", minutes: 2, seconds: 0 },
    { label: "3m", minutes: 3, seconds: 0 },
    { label: "5m", minutes: 5, seconds: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Workout Timer</h2>
          <p className="text-muted-foreground text-pretty">Time your rest periods and stay on track</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timer Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Set Timer</CardTitle>
            <CardDescription>Configure your rest period duration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minutes">Minutes</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMinutes(Math.max(0, minutes - 1))}
                    disabled={isActive}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Number.parseInt(e.target.value) || 0))}
                    disabled={isActive}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMinutes(Math.min(59, minutes + 1))}
                    disabled={isActive}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seconds">Seconds</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSeconds(Math.max(0, seconds - 15))}
                    disabled={isActive}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    step="15"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number.parseInt(e.target.value) || 0)))}
                    disabled={isActive}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSeconds(Math.min(59, seconds + 15))}
                    disabled={isActive}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presetTimes.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinutes(preset.minutes)
                      setSeconds(preset.seconds)
                    }}
                    disabled={isActive}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {!isActive ? (
                <Button onClick={startTimer} className="flex-1" disabled={minutes === 0 && seconds === 0}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="secondary" className="flex-1">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Timer
                </Button>
              )}
              <Button onClick={resetTimer} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timer Display */}
        <Card>
          <CardHeader>
            <CardTitle>Timer Display</CardTitle>
            <CardDescription>Current countdown and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-mono font-bold text-primary">
                {timeLeft > 0 ? formatTime(timeLeft) : formatTime(minutes * 60 + seconds)}
              </div>

              {totalTime > 0 && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                </div>
              )}

              <div className="space-y-2">
                {timeLeft === 0 && totalTime > 0 && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-primary font-medium">Rest period complete!</p>
                    <p className="text-sm text-muted-foreground">Ready for your next set</p>
                  </div>
                )}

                {isActive && timeLeft > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">Rest in progress...</p>
                    <p className="text-sm text-muted-foreground">Take your time to recover</p>
                  </div>
                )}

                {!isActive && timeLeft === 0 && totalTime === 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">Ready to start</p>
                    <p className="text-sm text-muted-foreground">Set your timer and begin your rest</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
