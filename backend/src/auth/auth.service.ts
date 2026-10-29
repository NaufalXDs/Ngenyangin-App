import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ngenyangin_secret_key';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: { name: string; email: string; password: string }) {
    // Validate inputs
    if (!dto.name || typeof dto.name !== 'string' || dto.name.trim().length === 0) {
      throw new BadRequestException('Name is required and must be a valid string');
    }
    if (!dto.email || typeof dto.email !== 'string' || !dto.email.includes('@') || !dto.email.includes('.')) {
      throw new BadRequestException('A valid email address is required');
    }
    if (!dto.password || typeof dto.password !== 'string' || dto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const emailClean = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: emailClean,
        password: hashedPassword,
        role: 'USER',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Registration successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(dto: { email: string; password: string }) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const emailClean = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: emailClean } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
