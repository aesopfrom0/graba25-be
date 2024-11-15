import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '@graba25-be/domains/auth/strategies/google.strategy';
import { UserSchema } from '@graba25-be/providers/databases/db/schemas/user.schema';
import { JwtStrategy } from '@graba25-be/domains/auth/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@graba25-be/domains/users/users.module';
import { DbServicesModule } from '@graba25-be/providers/databases/db/db-services.module';

@Module({
  imports: [
    DbServicesModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get('AUTH_ACCESS_TOKEN_TTL_IN_HOURS')}h` },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
