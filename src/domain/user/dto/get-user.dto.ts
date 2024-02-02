export class GetUserDto {
  readonly userId: number;
  readonly email: string;
  readonly name: string;
  readonly count: number;

  private constructor(userId?: number, email?: string, name?: string, count?: number) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.count = count;
  }

  static createInstance(id: number, email: string, name: string) {
    return new GetUserDto(id, email, name);
  }

  static withCountOnly(count: number) {
    return new GetUserDto(undefined, undefined, undefined, count);
  }
}