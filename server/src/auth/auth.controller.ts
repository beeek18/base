import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { User as PrismaUser } from 'generated/prisma';

import { AuthService } from './auth.service';

import { GoogleAuthDto } from './dto/google-auth.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { LoginRegisterAuthDto } from './dto/login-register-auth.dto';

import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';

import { MetaPayload } from './types/meta-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: LoginRegisterAuthDto, @Req() req: Request) {
    const meta: MetaPayload = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };
    return this.auth.register(dto, meta);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginRegisterAuthDto, @Req() req: Request) {
    const meta: MetaPayload = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };
    return this.auth.login(dto, meta);
  }

  @Public()
  @Post('google')
  async loginWithGoogle(@Body() dto: GoogleAuthDto, @Req() req: Request) {
    const meta: MetaPayload = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };
    return this.auth.loginWithGoogleToken(dto, meta);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() dto: JwtAuthDto, @Req() req: Request) {
    const meta: MetaPayload = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };
    return this.auth.refreshTokens(dto, meta);
  }

  @Post('logout')
  async logout(@Body() dto: JwtAuthDto, @User('id') userId: PrismaUser['id']) {
    await this.auth.logout(dto, userId);
    return { message: 'Logged out' };
  }
}
