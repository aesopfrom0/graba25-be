import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';
import ApplicationException from '@graba25-be/shared/exceptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/exceptions/error-code';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(user: Partial<User>): Promise<any> {
    const existingUser = await this.userModel.findOne({ email: user.email });

    if (existingUser) {
      return this.createJwtPayload(existingUser);
    }

    const newUser = new this.userModel(user);
    await newUser.save();
    return this.createJwtPayload(newUser);
  }

  createJwtPayload(user: User) {
    const payload = { sub: user.id, email: user.email, googleId: user.googleId };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  // 사용자 ID를 사용하여 새로운 액세스 토큰을 생성하는 메서드
  async generateAccessToken(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ApplicationException(
        new NotFoundException('User not exists'),
        ErrorCode.USER_NOT_EXISTS,
      );
    }
    const payload = { sub: user.id, email: user.email, googleId: user.googleId };
    return this.jwtService.sign(payload);
  }
}
