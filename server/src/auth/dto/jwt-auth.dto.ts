import { IsString } from 'class-validator';

export class JwtAuthDto {
  @IsString()
  refreshToken: string;
}
