import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserId } from '@graba25-be/shared/decorators/user-id.decorator';
import { UsersService } from '@graba25-be/domains/users/users.service';
import dayjs from 'dayjs';

@Controller('auth')
export class AuthController {
  private refreshTokenTtlInDays;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.refreshTokenTtlInDays = +(this.configService.get('AUTH_REFRESH_TOKEN_TTL_IN_DAYS') ?? 1);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {
    // 구글 인증 실행
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const googleUser = req.user;

    let user = await this.usersService.getUserByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.signUp({
        googleId: googleUser.googleId,
        name: googleUser.displayName,
        email: googleUser.email,
        photoUrl: googleUser.photoUrl,
        timeZone: googleUser.timeZone,
      });
    }

    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    const expiresAt = dayjs().add(this.refreshTokenTtlInDays, 'day').toDate();
    await this.authService.saveRefreshToken(user.id, refreshToken, expiresAt);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: this.refreshTokenTtlInDays * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${this.configService.get('BY25_URL')}/sign-in?token=${accessToken}`);
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt'))
  async refreshToken(@UserId() userId: string) {
    const newAccessToken = await this.authService.generateAccessToken(userId);
    return { accessToken: newAccessToken };
  }
}
