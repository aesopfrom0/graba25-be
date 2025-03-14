import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import ApplicationException from '@graba25-be/shared/exceptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/exceptions/error-code';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService, private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('SERVER_URL') + '/auth/google/callback',
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar.settings.readonly'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;

    // Fetch user's time zone
    const timeZone = await this.getUserTimeZone(accessToken);

    const user = {
      googleId: id,
      displayName,
      email: emails[0].value,
      photoUrl: photos[0].value,
      timeZone,
    };
    done(null, user);
  }

  private async getUserTimeZone(accessToken: string): Promise<string> {
    // settings/ 에서 locale 등 다른 정보도 한번에 가져올 수 있음
    const url = 'https://www.googleapis.com/calendar/v3/users/me/settings/timezone';

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.value; // e.g. 'Europe/Istanbul'
    } catch (e: any) {
      throw new ApplicationException(
        new InternalServerErrorException(`Failed to fetch user's time zone: ${e.message}`),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }
}
