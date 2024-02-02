import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(request: Request, res: Response, next: NextFunction) {
    const requestType = request.method;
    const clientIP = request.ip;
    const servletPath = request.originalUrl;
    const parameters = JSON.stringify(request.query);
    const content = JSON.stringify(request.body) === '{}' ? null : JSON.stringify(request.body);

    this.logRequestInfo(requestType, clientIP, servletPath, parameters, content);

    res.on('finish', () => {
      const responseCode = res.statusCode;
      const responseBody = res.get('Content-Type')?.includes('application/json') ? JSON.stringify(res.req.body) : 'Not JSON response';
      this.logResponseInfo(responseCode, responseBody);
    });

    next();
  }

  private logRequestInfo(requestType: string, clientIP: string, servletPath: string, parameters: string, content: string) {
    const logMessage = `Request type: ${requestType}, from IP: ${clientIP}, to servletPath: ${servletPath}, parameters: ${parameters}`;

    if (content) {
      Logger.info(logMessage + ', with body: ' + content);
    } else {
      Logger.info(logMessage);
    }
  }

  private logResponseInfo(responseCode: number, responseBody: string) {
    const logMessage = `Response with status code: ${responseCode}`;

    if (responseBody) {
      Logger.info(logMessage + ', with body: ' + responseBody);
    } else {
      Logger.info(logMessage);
    }
  }
}