import { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
export declare class LoggerMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction): void;
}
