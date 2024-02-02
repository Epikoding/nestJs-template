export class UpdateUserDto {
  readonly userId: number;
  readonly name: string;
  readonly email: string;
  readonly password: string;

  private constructor(userId: number, name: string, email: string, password: string) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static createInstance(userId?: number, name?: string, email?: string, password?: string) {
    return new UpdateUserDto(userId, name, email, password);
  }
}
