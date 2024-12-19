import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger: Logger;
    use(req: Request, res: Response, next: NextFunction) {
    this.logger = new Logger('AppModule');
        this.logger.log('Request Url--> ', req.originalUrl)
        next();
    }
}
