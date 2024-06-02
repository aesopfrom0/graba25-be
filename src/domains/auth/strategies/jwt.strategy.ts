import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@graba25-be/domains/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<Partial<User>> {
    return {
      id: payload.sub,
      email: payload.email,
      googleId: payload.googleId,
    };
  }
}
