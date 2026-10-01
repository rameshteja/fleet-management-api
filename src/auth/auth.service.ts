import { Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UserEntity, UserStatus } from '../users/entities/user.entity';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', {
        email: dto.email,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // if (
    //   user.status !== UserStatus.ACTIVE
    // ) {
    //   throw new UnauthorizedException(
    //     'Your account is not active.',
    //   );
    // }

    const payload = {
      sub: user.id,
      email: user.email,
      groupId: user.groupId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      data: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: '1h',

        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          groupId: user.groupId,
        },
      },

      metadata: {},
    };
  }
}
