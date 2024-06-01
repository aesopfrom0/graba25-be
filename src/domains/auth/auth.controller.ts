import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {
    console.log(req);
    // 구글 인증 실행
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    console.log(req.user);
    const jwt = this.authService.createJwtPayload(req.user);
    return res.redirect(`${this.configService.get('BY25_URL')}/sign-in?token=${jwt.accessToken}`);
  }
}
