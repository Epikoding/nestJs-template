export abstract class BaseDto {
  id: number;
  createdAt: Date;
  modifiedAt: Date;

  protected constructor(id: number, createdAt: Date, modifiedAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
  }
}
