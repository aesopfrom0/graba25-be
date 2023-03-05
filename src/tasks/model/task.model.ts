import { Field, Int, ObjectType } from '@nestjs/graphql';

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

  @Field()
  memo!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
