import { HttpStatus } from '@nestjs/common';

export class Result<T> {
  status: number;
  message: string;
  data?: T;

  constructor(status: HttpStatus, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(data?: T): Result<T> {
    return new Result<T>(HttpStatus.OK, 'Success', data);
  }

  static error<T>(status: HttpStatus, message: string): Result<T> {
    return new Result<T>(status, message);
  }

  // Additional constructors or static methods for specific scenarios...
}
