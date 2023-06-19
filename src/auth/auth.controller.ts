import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
export class AuthController {
  private readonly googleAuthClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor() {
    this.googleClientId = new ConfigService().get('GOOGLE_CLIENT_ID') ?? '';
    this.googleAuthClient = new OAuth2Client(this.googleClientId);
  }

  @Post('google')
  async googleAuth(@Body() { token }: { token: string }) {
    try {
      // Verify the token with Google's API
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken: token,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();

      // Check if the user exists in the database or create a new user
      // ...
      // Generate a session token or access token for the user
    } catch (e) {
      throw new UnauthorizedException(`Error occurred while verifying Google token, ${e}`);
    }
  }
}
