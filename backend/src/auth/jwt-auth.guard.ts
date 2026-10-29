import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ngenyangin_secret_key';

@Injectable()
export class JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
