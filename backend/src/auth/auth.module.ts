import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
