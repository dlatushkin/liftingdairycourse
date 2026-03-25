"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().optional(),
  startedAt: z.date(),
});

type UpdateWorkoutParams = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkoutAction(params: UpdateWorkoutParams) {
  const parsed = updateWorkoutSchema.safeParse(params);
  if (!parsed.success) throw new Error("Invalid input");

  return updateWorkout(parsed.data.workoutId, parsed.data.name, parsed.data.startedAt);
}
