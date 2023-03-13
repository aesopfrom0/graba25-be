import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
export class Task {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field()
  title!: string;

  @Field(() => Int)
  estAttempts!: number;

  @Field(() => Int)
  actAttempts!: number;

  @Field({ defaultValue: '' })
  memo!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType('CreateTaskInput')
export class CreateTaskInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  @IsNotEmpty()
  estAttempts!: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  @IsNotEmpty()
  actAttempts!: number;

  @Field({ defaultValue: '' })
  @IsString()
  memo!: string;
}
