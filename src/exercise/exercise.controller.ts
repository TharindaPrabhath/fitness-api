import { Body, Controller, Get, Post, Delete, Param, UseGuards, Patch, Query } from '@nestjs/common';
import { JwtAuthGuard, RoleGuard } from '../auth/guard';
import { CheckRole, GetUser } from '../auth/decorator/index';
import { ExerciseService } from './exercise.service';
import { Pagination } from 'src/common/types';
import { GetPagination } from 'src/common';
import { CreateExerciseDto, EdiExerciseDto } from './dto';
import { ValidateUUID } from 'src/common/pipes';

@Controller('exercises')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Get('/:id')
  async getExerciseById(@Param('id') workoutId: string) {
    return this.exerciseService.getExerciseById(workoutId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getExercises(@GetUser('id') userId: string, @GetPagination() pagination: Pagination) {
    return this.exerciseService.getExercises(pagination);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @CheckRole('ADMIN')
  @Post('/')
  async createExercise(@GetUser('id') userId: string, @Body() dto: CreateExerciseDto) {
    return this.exerciseService.createExercise(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @CheckRole('ADMIN')
  @Patch('/:id')
  async editExercise(
    @GetUser('id') userId: string,
    @Param('id', ValidateUUID) workoutId: string,
    @Body() dto: EdiExerciseDto,
  ) {
    return this.exerciseService.editExercise(workoutId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @CheckRole('ADMIN')
  @Delete('/:id')
  async deleteExercise(@Param('id', ValidateUUID) workoutId: string) {
    return this.exerciseService.deleteExercise(workoutId);
  }
}
