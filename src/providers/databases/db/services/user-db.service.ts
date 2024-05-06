import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseService } from '@graba25-be/providers/base.service';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';
import { BaseResponseDto } from '@graba25-be/shared/dtos/base-response.dto';
import {
  CreateUserBodyDto,
  UpdateUserBodyDto,
} from '@graba25-be/shared/dtos/requests/user-request.dto';
import { UserResponseDto } from '@graba25-be/shared/dtos/responses/user-response.dto';

export class UserDbService extends BaseService {
  constructor(@InjectModel('User') private readonly userModel: mongoose.Model<User>) {
    super();
  }

  async createUser(dto: CreateUserBodyDto): Promise<BaseResponseDto<UserResponseDto>> {
    try {
      const user = new this.userModel({
        name: dto.name,
        email: dto.email,
        password: dto.password,
      });
      const resp = await user.save();
      return { ok: true, body: new UserResponseDto(resp) };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async readUser(id: string): Promise<BaseResponseDto<UserResponseDto>> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      return { ok: true, body: new UserResponseDto(user) };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async readUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async updateUser(id: string, dto: UpdateUserBodyDto): Promise<BaseResponseDto<string>> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      Object.entries(dto).forEach(([key, value]) => {
        if (key !== 'id' && value !== undefined) {
          user[key] = value;
        }
      });
      await user.save();
      return { ok: true, body: id };
    } catch (e) {
      this.logger.error(`[${this.updateUser.name}] Error: ${e}`);
      return { ok: false, error: JSON.stringify(e) };
    }
  }
}
