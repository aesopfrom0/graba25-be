import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';

export class CreateUserBodyDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsStrongPassword({ minLength: 4 })
  password!: string;

  @ApiProperty()
  timeZone!: string;
}

export class UpdateUserBodyDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsStrongPassword({ minLength: 4 })
  password?: string;

  @ApiProperty()
  timeZone?: string;
}
