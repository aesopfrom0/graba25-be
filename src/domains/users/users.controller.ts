import { UsersService } from '@graba25-be/domains/users/users.service';
import { UserId } from '@graba25-be/shared/decorators/user-id.decorator';
import {
  CreateUserBodyDto,
  UpdateUserBodyDto,
} from '@graba25-be/shared/dtos/requests/user-request.dto';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async user(@UserId() userId: string) {
    return await this.usersService.user(userId);
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
