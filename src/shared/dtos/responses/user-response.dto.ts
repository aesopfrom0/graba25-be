import { User } from 'src/providers/databases/mongodb/schemas/user.schema';

export class UserResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  id!: number;
  name!: string;
  email!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
