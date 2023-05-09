import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/types';
import { DbService } from 'src/db/db.service';
import { CreateWorkoutDto, EditWorkoutDto } from './dto';

@Injectable()
export class WorkoutService {
  constructor(private db: DbService) {}

  async getWorkoutById(workoutId: string) {
    const workout = await this.db.workout.findUniqueOrThrow({
      where: { id: workoutId },
    });
    return workout;
  }

  async getWorkouts(pagination: Pagination) {
    const workouts = await this.db.workout.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'asc' },
    });
    return workouts;
  }

  async createWorkout(userId: string, dto: CreateWorkoutDto) {
    const workout = await this.db.workout.create({
      data: dto,
    });
    return workout;
  }

  async editWorkout(workoutId: string, dto: EditWorkoutDto) {
    const workout = await this.db.workout.update({
      where: { id: workoutId },
      data: dto,
    });
    return workout;
  }

  async deleteWorkout(workoutId: string) {
    await this.db.workout.delete({ where: { id: workoutId } });
  }
}
