import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Result } from '../../../base.result';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // Main catch method to handle exceptions
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = this.getStatus(exception); // Determine the HTTP status code based on the exception type
    const message = this.getErrorMessage(exception); // Extract error message based on the exception type
    response.status(status).json(Result.error(status, message)); // Send the error response
    this.logExceptionDetails(request, exception); // Log the exception details along with the request that caused it
  }

  // Helper method to determine the HTTP status code
  private getStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // Helper method to extract the error message from the exception
  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string' ? response : response['message'] || 'An error occurred';
    } else if (exception instanceof Error) {
      return exception.message;
    }
    return 'Internal server error';
  }

  // Method to log exception and request details
  private logExceptionDetails(request: Request, exception: unknown): void {
    const { method, url, query, body } = request;
    this.logger.error(`Exception occurred for [${method}] ${url} with query params: ${JSON.stringify(query)} and body: ${JSON.stringify(body)}`);

    if (exception instanceof Error) {
      this.logger.error(exception.stack);
    } else {
      this.logger.error(`Unhandled exception type: ${typeof exception}`);
    }
  }
}
