import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBooleanString, IsString } from 'class-validator';

export class ProjectQueryDto {
  @ApiProperty({
    description: 'Title of the project',
    example: 'Project 1',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the project',
    example: 'Description of project 1',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  // @ApiProperty({
  //   description: 'Due date of the project',
  //   example: '2024-12-31',
  //   type: String,
  //   required: false,
  // })
  // @IsOptional()
  // @IsDateString()
  // dueDate?: Date;

  @ApiProperty({
    description: 'Is the project finished?',
    example: false,
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBooleanString()
  isFinished?: boolean;

  @ApiProperty({
    description: 'Is the project archived?',
    example: false,
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBooleanString()
  isArchived?: boolean;
}
