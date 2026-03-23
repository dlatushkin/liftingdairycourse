"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Workout = {
  id: number;
  name: string | null;
  startedAt: Date;
  completedAt: Date | null;
  exerciseCount: number;
};

export default function WorkoutCalendar({
  workouts,
  selectedDate,
}: {
  workouts: Workout[];
  selectedDate: Date;
}) {
  const router = useRouter();

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          Workouts for {format(selectedDate, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No workouts logged for this date.
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {workout.name ?? "Untitled Workout"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground flex gap-4">
                <span>{workout.exerciseCount} exercises</span>
                <span>{format(workout.startedAt, "h:mm a")}</span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
