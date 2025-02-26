import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@graba25-be/domains/users/users.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private refreshTokenTtlInDays: number;
  private isLocal = false;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.refreshTokenTtlInDays = +(this.configService.get('AUTH_REFRESH_TOKEN_TTL_IN_DAYS') ?? 1);
    this.isLocal = this.configService.get('NODE_ENV') === 'local';
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
        displayName: googleUser.displayName,
        email: googleUser.email,
        photoUrl: googleUser.photoUrl,
        timeZone: googleUser.timeZone,
      });
    }

    const { accessToken, expirationTime } = await this.authService.generateAccessTokenData(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    await this.authService.saveRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isLocal ? false : true,
      maxAge: this.refreshTokenTtlInDays * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${this.configService.get(
        'BY25_URL',
      )}/sign-in?token=${accessToken}&expirationTime=${expirationTime}`,
    );
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken);
    }

    // 쿠키에서 리프레시 토큰을 제거합니다.
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.isLocal ? false : true,
      sameSite: this.isLocal ? 'lax' : 'none',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    try {
      // Validate the refresh token and generate new tokens
      const userId = await this.authService.verifyRefreshToken(refreshToken);
      const { accessToken: newAccessToken, expirationTime } =
        await this.authService.generateAccessTokenData(userId);
      const newRefreshToken = await this.authService.generateRefreshToken(userId);

      // Revoke the old refresh token and save the new one
      await this.authService.revokeRefreshToken(refreshToken);
      await this.authService.saveRefreshToken(userId, newRefreshToken);

      // Set the new refresh token in HttpOnly cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: this.isLocal ? false : true,
        sameSite: this.isLocal ? 'lax' : 'none',
        maxAge: this.refreshTokenTtlInDays * 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken: newAccessToken, expirationTime });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
}
