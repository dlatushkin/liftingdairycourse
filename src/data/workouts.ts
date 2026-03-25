import { db } from "@/db";
import { workouts, workoutExercises } from "@/db/schema";
import { eq, count, and, gte, lt } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(name: string | undefined, startedAt: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name: name || null, startedAt })
    .returning();

  return workout;
}

export async function getWorkoutById(workoutId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));

  return workout ?? null;
}

export async function updateWorkout(workoutId: number, name: string | undefined, startedAt: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .update(workouts)
    .set({ name: name || null, startedAt, updatedAt: new Date() })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();

  return workout;
}

export async function getWorkoutsForCurrentUser(date?: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dateFilter = date
    ? and(
        gte(workouts.startedAt, new Date(date.getFullYear(), date.getMonth(), date.getDate())),
        lt(workouts.startedAt, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))
      )
    : undefined;

  const rows = await db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseCount: count(workoutExercises.id),
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .where(and(eq(workouts.userId, userId), dateFilter))
    .groupBy(workouts.id);

  return rows;
}
