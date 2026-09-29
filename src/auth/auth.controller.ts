import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { ApiResponseMessage } from '../common/decorators/api-response.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:
      AuthService,
  ) { }

  @Post('login')
  @ApiResponseMessage('Login successful.')
  async login(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }
}