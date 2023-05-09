import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/types';
import { DbService } from 'src/db/db.service';
import { CreateExerciseDto, EdiExerciseDto } from './dto';

@Injectable()
export class ExerciseService {
  constructor(private db: DbService) {}

  async getExerciseById(exerciseId: string) {
    const exercise = await this.db.exercise.findUniqueOrThrow({
      where: { id: exerciseId },
    });
    return exercise;
  }

  async getExercises(pagination: Pagination) {
    const exercises = await this.db.exercise.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'asc' },
    });
    return exercises;
  }

  async createExercise(userId: string, dto: CreateExerciseDto) {
    const exercise = await this.db.exercise.create({
      data: dto,
    });
    return exercise;
  }

  async editExercise(exerciseId: string, dto: EdiExerciseDto) {
    const exercise = await this.db.exercise.update({
      where: { id: exerciseId },
      data: dto,
    });
    return exercise;
  }

  async deleteExercise(exerciseId: string) {
    await this.db.exercise.delete({ where: { id: exerciseId } });
  }
}
