import { getWorkoutsForCurrentUser } from "@/data/workouts";
import WorkoutCalendar from "./_components/WorkoutCalendar";

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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <WorkoutCalendar workouts={workouts} selectedDate={selectedDate} />
    </div>
  );
}
