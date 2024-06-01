import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';
import { AuthService } from '@graba25-be/domains/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<User> {
    console.log(payload);
    const { sub: googleId } = payload;
    const user = await this.authService.validateUser({ googleId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
