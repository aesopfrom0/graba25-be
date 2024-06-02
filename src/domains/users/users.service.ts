import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDbService } from '@graba25-be/providers/databases/db/services/user-db.service';
import {
  CreateUserBodyDto,
  UpdateUserBodyDto,
} from '@graba25-be/shared/dtos/requests/user-request.dto';
import ApplicationException from '@graba25-be/shared/exceptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/exceptions/error-code';

@Injectable()
export class UsersService {
  constructor(private readonly userDbService: UserDbService) {}

  async user(id: string) {
    return await this.userDbService.readUser(id);
  }

  async singUp(userDto: CreateUserBodyDto) {
    const existingUser = await this.userDbService.readUserByEmail(userDto.email);
    if (existingUser) {
      throw new ApplicationException(
        new BadRequestException('User already exists'),
        ErrorCode.USER_EMAIL_EXISTS,
      );
    }
    return await this.userDbService.createUser(userDto);
  }

  async updateUser(id: string, userDto: UpdateUserBodyDto) {
    return await this.userDbService.updateUser(id, userDto);
  }

  async getUserByEmail(email: string) {
    return await this.userDbService.readUserByEmail(email);
  }
}
