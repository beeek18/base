import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';

import { PrismaService } from 'src/prisma/prisma.service';

import { GoogleAuthDto } from './dto/google-auth.dto';
import { LoginRegisterAuthDto } from './dto/login-register-auth.dto';

import { JwtAuthDto } from './dto/jwt-auth.dto';
import { GoogleUserInfo } from './types/google-access-token.type';
import { JwtPayload } from './types/jwt-payload.type';
import { MetaPayload } from './types/meta-payload.type';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.saltRounds = parseInt(this.config.getOrThrow<string>('PASSWORD_SALT_ROUNDS'));
  }

  async register(dto: LoginRegisterAuthDto, meta: MetaPayload) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, this.saltRounds);

    const user = await this.prisma.user.create({
      data: { email: dto.email, hashPassword: hashed },
    });

    return this.createSessionForUser(user, meta);
  }

  async login(dto: LoginRegisterAuthDto, meta: MetaPayload) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.hashPassword) {
      throw new UnauthorizedException('No user found with this email or password not set');
    }

    const ok = await bcrypt.compare(dto.password, user.hashPassword);
    if (!ok) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.createSessionForUser(user, meta);
  }

  async loginWithGoogleToken(dto: GoogleAuthDto, meta: MetaPayload) {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${dto['accessToken']}`,
      },
    });

    if (!res.ok) {
      throw new BadRequestException('Failed to fetch user info from Google');
    }

    const userInfo = (await res.json()) as GoogleUserInfo;

    const { sub: googleId, email, name } = userInfo;

    if (!googleId || !email || !name) {
      throw new BadRequestException('Google token missing email or sub');
    }

    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { email, googleId, name },
      });
    }

    return this.createSessionForUser(user, meta);
  }

  private async createSessionForUser(user: User, meta: MetaPayload) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
      },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
      },
    );

    const { exp } = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
    if (!exp) throw new Error('Cannot parse refresh token exp');
    const expiresAt = new Date(exp * 1000);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
        ...meta,
      },
    });

    const data = {
      tokens: { accessToken, refreshToken },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        status: user.status,
        googleId: user.googleId,
      },
    };

    return data;
  }

  async refreshTokens(dto: JwtAuthDto, meta: MetaPayload) {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(dto['refreshToken'], {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new UnauthorizedException('No user found with this email or password not set');
    }

    const session = await this.prisma.session.findUnique({
      where: { refreshToken: dto['refreshToken'], userId: payload.sub },
    });
    if (!session || session.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const accessToken = await this.jwt.signAsync(
      { sub: payload.sub },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
      },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: payload.sub },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
      },
    );

    const { exp } = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
    if (!exp) throw new Error('Cannot parse refresh token exp');
    const expiresAt = new Date(exp * 1000);

    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshToken, expiresAt, ...meta },
    });

    const data = {
      tokens: { accessToken, refreshToken },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        status: user.status,
        googleId: user.googleId,
      },
    };

    return data;
  }

  async logout(dto: JwtAuthDto, userId: User['id']) {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken: dto['refreshToken'], userId, revoked: false },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found or already revoked');
    }

    await this.prisma.session.update({
      where: { id: session.id },
      data: { revoked: true },
    });

    return { message: 'Logged out successfully' };
  }
}
