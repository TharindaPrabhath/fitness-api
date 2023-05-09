import { Body, Controller, Get, Post, Delete, Param, UseGuards, Patch, Query } from '@nestjs/common';
import { JwtAuthGuard, RoleGuard } from '../auth/guard';
import { CheckRole, GetUser } from '../auth/decorator/index';
import { WorkoutService } from './workout.service';
import { Pagination } from 'src/common/types';
import { GetPagination } from 'src/common';
import { CreateWorkoutDto, EditWorkoutDto } from './dto';
import { ValidateUUID } from 'src/common/pipes';

@Controller('workouts')
export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  @Get('/:id')
  async getWorkoutById(@Param('id') workoutId: string) {
    return this.workoutService.getWorkoutById(workoutId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getWorkouts(@GetUser('id') userId: string, @GetPagination() pagination: Pagination) {
    return this.workoutService.getWorkouts(pagination);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @CheckRole('ADMIN')
  @Post('/')
  async createWorkout(@GetUser('id') userId: string, @Body() dto: CreateWorkoutDto) {
    return this.workoutService.createWorkout(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @CheckRole('ADMIN')
  @Patch('/:id')
  async editWorkout(
    @GetUser('id') userId: string,
    @Param('id', ValidateUUID) workoutId: string,
    @Body() dto: EditWorkoutDto,
  ) {
    return this.workoutService.editWorkout(workoutId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @CheckRole('ADMIN')
  @Delete('/:id')
  async deleteWorkout(@Param('id', ValidateUUID) workoutId: string) {
    return this.workoutService.deleteWorkout(workoutId);
  }
}
