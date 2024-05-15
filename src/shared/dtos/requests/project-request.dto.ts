import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBooleanString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectRequestDto {
  @ApiProperty({
    description: 'Title of the project',
    example: 'Project 1',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Description of the project',
    example: 'Description of project 1',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Due date of the project',
    example: '2024-12-31',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    description: 'Is the project finished?',
    example: false,
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value === 'true' || value === '1' || value === true)
  isFinished?: boolean;

  @ApiProperty({
    description: 'Is the project archived?',
    example: false,
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === '1' || value === true)
  @IsBooleanString()
  isArchived?: boolean;
}

export class UpdateProjectRequestDto extends PartialType(CreateProjectRequestDto) {}
