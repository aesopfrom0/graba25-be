import { UsersService } from '@graba25-be/domains/users/users.service';
import {
  CreateUserBodyDto,
  UpdateUserBodyDto,
} from '@graba25-be/shared/dtos/requests/user-request.dto';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async user(@Param('id') id: string) {
    return await this.usersService.user(id);
  }

  @Post('')
  async signUp(@Body() userDto: CreateUserBodyDto) {
    return await this.usersService.singUp(userDto);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userDto: UpdateUserBodyDto) {
    return await this.usersService.updateUser(id, userDto);
  }
}
