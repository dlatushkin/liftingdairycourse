"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockWorkouts = [
  {
    id: 1,
    name: "Morning Strength",
    date: new Date(2026, 2, 23),
    exercises: 5,
    duration: "45 min",
    type: "Strength",
  },
  {
    id: 2,
    name: "Cardio Session",
    date: new Date(2026, 2, 23),
    exercises: 3,
    duration: "30 min",
    type: "Cardio",
  },
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const workoutsForDate = mockWorkouts.filter(
    (w) =>
      format(w.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Workouts for {format(selectedDate, "do MMM yyyy")}
          </h2>

          {workoutsForDate.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No workouts logged for this date.
              </CardContent>
            </Card>
          ) : (
            workoutsForDate.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                    <Badge variant="secondary">{workout.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground flex gap-4">
                  <span>{workout.exercises} exercises</span>
                  <span>{workout.duration}</span>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
