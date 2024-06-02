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
}
