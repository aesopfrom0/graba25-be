import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseService } from '@graba25-be/providers/base.service';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';
import {
  CreateUserBodyDto,
  UpdateUserBodyDto,
} from '@graba25-be/shared/dtos/requests/user-request.dto';
import { UserResponseDto } from '@graba25-be/shared/dtos/responses/user-response.dto';
import ApplicationException from '@graba25-be/shared/excenptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/excenptions/error-code';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class UserDbService extends BaseService {
  constructor(@InjectModel('User') private readonly userModel: mongoose.Model<User>) {
    super();
  }

  async createUser(dto: CreateUserBodyDto): Promise<UserResponseDto> {
    try {
      const user = new this.userModel({
        name: dto.name,
        email: dto.email,
        password: dto.password,
      });
      const resp = await user.save();
      return new UserResponseDto(resp);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(UserDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async readUser(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new ApplicationException(
          new BadRequestException('User not found'),
          ErrorCode.USER_NOT_EXISTS,
        );
      }
      return new UserResponseDto(user);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(UserDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async readUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ email });
    return user ? new UserResponseDto(user) : null;
  }

  async updateUser(id: string, dto: UpdateUserBodyDto): Promise<string> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new ApplicationException(
          new BadRequestException('User not found'),
          ErrorCode.USER_NOT_EXISTS,
        );
      }
      Object.entries(dto).forEach(([key, value]) => {
        if (key !== 'id' && value !== undefined) {
          user[key] = value;
        }
      });
      await user.save();
      return id;
    } catch (e) {
      this.logger.error(`[${this.updateUser.name}] Error: ${e}`);
      throw new ApplicationException(
        new InternalServerErrorException(UserDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }
}
