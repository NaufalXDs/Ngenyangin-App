import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ngenyangin_secret_key';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private async verifyTurnstile(token?: string) {
    const turnstileSecret = process.env.Turnstile_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) return;

    if (!token) {
      throw new BadRequestException('Turnstile verification required');
    }

    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: token,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new BadRequestException('Turnstile verification failed');
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      if (turnstileSecret.startsWith('1x00000000000000000000')) return;
      throw new BadRequestException('Turnstile verification error');
    }
  }

  async register(dto: { name: string; username?: string; email: string; password: string; turnstileToken?: string }) {
    await this.verifyTurnstile(dto.turnstileToken);

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
    const existingEmail = await this.prisma.user.findUnique({ where: { email: emailClean } });
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    const usernameClean = dto.username && dto.username.trim()
      ? dto.username.trim()
      : dto.name.trim();

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        username: usernameClean,
        email: emailClean,
        password: hashedPassword,
        role: 'USER',
      },
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Registration successful',
      token,
      user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(dto: { emailOrUsername?: string; email?: string; password: string; turnstileToken?: string }) {
    await this.verifyTurnstile(dto.turnstileToken);

    const identifier = dto.emailOrUsername || dto.email;
    if (!identifier || !dto.password) {
      throw new BadRequestException('Email/Username and password are required');
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId },
          { username: cleanId },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email/username or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email/username or password');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
    };
  }
}
