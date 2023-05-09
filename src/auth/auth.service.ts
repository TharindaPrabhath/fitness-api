import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { DbService } from '../db/db.service';
import { AuthConfig, HASH_ROUNDS } from './constants';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import { decodeToken } from './util';

@Injectable()
export class AuthService {
  constructor(private db: DbService, private jwtService: JwtService, private configService: ConfigService) {}

  async signup(dto: SignUpDto) {
    const hashed = await bcrypt.hash(dto.password, HASH_ROUNDS);

    // Check whether the user with this email already exists or not
    const exists = await this.db.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException(`An user has been already registered with this email, ${dto.email}`);

    const user = await this.db.user.create({
      data: {
        ...dto,
        password: hashed,
        role: dto?.role ?? Role.USER,
      },
    });
  }

  async signin(dto: SignInDto) {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });
    if (!user) throw new ForbiddenException('Incorrect credentials');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Incorrect credentials');

    // Generate access and refresh tokens
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );

    delete user.password;
    return { accessToken, refreshToken, user };
  }

  async refreshToken(dto: RefreshTokenDto) {
    // Decode the refresh token
    const payload = decodeToken(dto.refreshToken);
    const userId = payload?.sub;
    const user = await this.db.user.findUnique({ where: { id: userId } });
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );
    return {
      accessToken,
      refreshToken: dto.refreshToken,
    };
  }
}
