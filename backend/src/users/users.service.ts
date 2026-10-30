import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async createUser(dto: { name: string; email: string; password: string; role?: string }) {
    if (!dto.name || !dto.email || !dto.password) {
      throw new BadRequestException('Name, email, and password are required');
    }
    const emailClean = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role && ['USER', 'REVIEWER', 'ADMIN'].includes(dto.role) ? dto.role : 'USER';

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: emailClean,
        password: hashedPassword,
        role: role as any,
      },
    });

    return {
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async updateRole(idStr: string, role: string) {
    if (!['USER', 'REVIEWER', 'ADMIN'].includes(role)) {
      throw new BadRequestException('Invalid role specified');
    }

    const id = Number(idStr);
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: { id: true, name: true, email: true, role: true },
    });

    return { message: 'User role updated successfully', user: updated };
  }

  async remove(idStr: string) {
    const id = Number(idStr);
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
