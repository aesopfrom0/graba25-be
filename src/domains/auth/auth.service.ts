import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';
import { UserDbService } from '@graba25-be/providers/databases/db/services/user-db.service';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { AccessTokenResponseDto } from '@graba25-be/shared/dtos/responses/token-response.dto';

@Injectable()
export class AuthService {
  private accessTokenTtlInHours: number;
  private refreshTokenTtlInDays: number;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private userDbService: UserDbService,
    private configService: ConfigService,
  ) {
    this.refreshTokenTtlInDays = +(this.configService.get('AUTH_REFRESH_TOKEN_TTL_IN_DAYS') ?? 30);
    this.accessTokenTtlInHours = +(this.configService.get('AUTH_ACCESS_TOKEN_TTL_IN_HOURS') ?? 12);
  }

  async generateAccessTokenData(userId: string): Promise<AccessTokenResponseDto> {
    return {
      accessToken: await this.jwtService.signAsync({ userId }),
      expirationTime: dayjs().add(this.accessTokenTtlInHours, 'hour').unix(),
    };
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.sign({ userId }, { expiresIn: `${this.refreshTokenTtlInDays}d` });
  }

  async saveRefreshToken(userId: string, token: string) {
    const expiresAt = dayjs().add(this.refreshTokenTtlInDays, 'day').toDate();
    await this.userDbService.upsertRefreshToken(userId, token, expiresAt);
  }

  async verifyRefreshToken(token: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(token);
      const storedToken = await this.userDbService.readRefreshToken({ token, isRevoked: false });
      if (!storedToken) throw new Error('Token is invalid or revoked');
      return payload.userId;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.userDbService.updateRefreshToken(token, { isRevoked: true });
  }
}
