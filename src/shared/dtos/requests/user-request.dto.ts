export class CreateUserBodyDto {
  name!: string;
  email!: string;
  password!: string;
}

export class UpdateUserBodyDto {
  name?: string;
  email?: string;
  password?: string;
}
