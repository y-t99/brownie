import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../decorator';
import { AuthService } from '../service';
import { SigninRo, SignupRo } from './ro';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() body: SignupRo) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  async signin(@Body() body: SigninRo) {
    return this.authService.signin(body);
  }

}