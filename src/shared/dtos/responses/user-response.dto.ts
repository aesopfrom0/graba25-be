import { User } from 'src/providers/databases/db/schemas/user.schema';

export class UserResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.displayName = user.displayName;
    this.email = user.email;
    this.googleId = user.googleId;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  id!: string;
  displayName!: string;
  email!: string;
  googleId?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
