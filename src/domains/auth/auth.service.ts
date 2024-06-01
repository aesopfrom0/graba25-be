import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(user: Partial<User>): Promise<any> {
    console.log(user);
    const existingUser = await this.userModel.findOne({ googleId: user.googleId });

    if (existingUser) {
      return this.createJwtPayload(existingUser);
    }

    const newUser = new this.userModel(user);
    await newUser.save();
    return this.createJwtPayload(newUser);
  }

  createJwtPayload(user: User) {
    const payload = { sub: user.googleId, email: user.email };
    const token = this.jwtService.sign(payload);
    console.log('JWT Payload:', payload); // 로그 추가
    console.log('JWT Token:', token); // 로그 추가
    return {
      accessToken: token,
    };
  }
}
