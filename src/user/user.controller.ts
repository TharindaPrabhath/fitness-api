import { Body, Controller, Get, Delete, Param, UseGuards, Patch, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator/index';
import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { ValidateUUID } from 'src/common/pipes';
import { GetPagination } from 'src/common';
import { Pagination } from 'src/common/types';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@GetUser('id') userId: string) {
    return this.userService.getUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUser(@Param('id', ValidateUUID) userId: string) {
    return this.userService.getUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUsers(@Query('role') role: string, @GetPagination() pagination: Pagination) {
    return this.userService.getUsers(role as any, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async editUser(@Param('id', ValidateUUID) userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteUser(@Param('id', ValidateUUID) userId: string) {
    return this.userService.deleteUser(userId);
  }
}
