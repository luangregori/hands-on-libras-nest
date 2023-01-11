import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers?.['x-access-token']
      if (accessToken) {
        // TODO: pegar secret
        const token = jwt.verify(accessToken, process.env.JWT_VERIFICATION_TOKEN_SECRET)
        if (token) {
          req.body.accountId = token.id
          next()
          return
        }
      }
      next(new UnauthorizedException('Access denied'))
    } catch (error) {
      next(new UnauthorizedException('Access denied'))
    }
  }
}
