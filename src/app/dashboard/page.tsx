import Link from "next/link";
import { getWorkoutsForCurrentUser } from "@/data/workouts";
import WorkoutCalendar from "./_components/WorkoutCalendar";
import { Button } from "@/components/ui/button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  const workouts = await getWorkoutsForCurrentUser(selectedDate);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/workouts/new">+ New Workout</Link>
        </Button>
      </div>
      <WorkoutCalendar workouts={workouts} selectedDate={selectedDate} />
    </div>
  );
}
