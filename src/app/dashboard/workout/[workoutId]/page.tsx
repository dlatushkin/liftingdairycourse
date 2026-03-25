import { notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import EditWorkoutForm from "./_components/EditWorkoutForm";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(Number(workoutId));

  if (!workout) notFound();

  return <EditWorkoutForm workout={workout} />;
}
