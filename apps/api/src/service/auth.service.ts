import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { ERROR_MESSAGE } from '../exception';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(input: Partial<Pick<User, 'name' | 'password' | 'email'>>) {
    const uuid = await this.userService.create(input);
    const userProfile = await this.userService.retrieveUserProfileByUuid(uuid);
    const token = await this.jwtService.signAsync({
      user: {
        uuid: userProfile.uuid,
        name: userProfile.name,
        email: userProfile.email,
        roles: [],
      },
    });
    return token;
  }

  async signin(input: Required<Pick<User, 'email' | 'password'>>) {
    const userRecord = await this.userService.retrieveUserProfileByEmail(input.email);
    
    if (!userRecord) {
      throw new HttpException(ERROR_MESSAGE.ResourceNotFound, HttpStatus.NOT_FOUND);
    }

    const isPassValid = await this.userService.comparePassword(input.password, userRecord.password);
    if (!isPassValid) {
      throw new HttpException(ERROR_MESSAGE.InvalidCredentials, HttpStatus.UNAUTHORIZED);
    }

    const token = await this.jwtService.signAsync({
      user: {
        uuid: userRecord.uuid,
        name: userRecord.name,
        email: userRecord.email,
        roles: [],
      },
    });

    return token;
  }
}

