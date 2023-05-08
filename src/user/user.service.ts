import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Pagination } from 'src/common/types';
import { EditUserDto } from './dto/index';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  async getUser(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });
    delete user.password;
    return user;
  }

  async getUsers(role: keyof typeof Role, pagination: Pagination) {
    const users = await this.db.user.findMany({
      where: { role: role ?? 'USER' },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { [pagination.sort.field]: pagination.sort.by },
    });
    return users;
  }

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.db.user.update({
      where: { id: userId },
      data: dto,
    });
    return user;
  }

  async deleteUser(userId: string) {
    await this.db.user.delete({ where: { id: userId } });
  }
}
