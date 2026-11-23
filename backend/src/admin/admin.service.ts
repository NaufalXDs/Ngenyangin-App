import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(currentUser: any) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can access user management');
    }
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUser(id: string, dto: { name?: string; username?: string; email?: string; role?: string }, currentUser: any) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can update users');
    }

    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const data: any = {};

    if (dto.name && dto.name.trim()) {
      data.name = dto.name.trim();
    }

    if (dto.username !== undefined) {
      data.username = dto.username.trim() || (dto.name ? dto.name.trim() : targetUser.name);
    }

    if (dto.email && dto.email.trim()) {
      const emailClean = dto.email.trim().toLowerCase();
      if (emailClean !== targetUser.email) {
        const existing = await this.prisma.user.findUnique({ where: { email: emailClean } });
        if (existing) {
          throw new ConflictException('Email is already registered');
        }
        data.email = emailClean;
      }
    }

    if (dto.role && ['USER', 'REVIEWER', 'ADMIN'].includes(dto.role)) {
      if (targetUser.role === 'ADMIN' && dto.role !== 'ADMIN') {
        const adminCount = await this.prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
          throw new BadRequestException('The system must always keep at least one active ADMIN');
        }
      }
      data.role = dto.role as any;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, email: true, name: true, role: true },
    });

    return { message: 'User updated successfully', user: updated };
  }

  async updateUserRole(id: string, newRole: string, currentUser: any) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can update user roles');
    }

    if (id === currentUser.id) {
      throw new BadRequestException('An admin cannot change their own role');
    }

    if (!['USER', 'REVIEWER', 'ADMIN'].includes(newRole)) {
      throw new BadRequestException('Invalid role');
    }

    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.role === 'ADMIN' && newRole !== 'ADMIN') {
      const adminCount = await this.prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        throw new BadRequestException('The system must always keep at least one active ADMIN');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: newRole as any },
      select: { id: true, username: true, email: true, name: true, role: true },
    });
  }

  async deleteUser(id: string, currentUser: any) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can delete users');
    }

    if (id === currentUser.id) {
      throw new BadRequestException('An admin cannot delete themselves');
    }

    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.role === 'ADMIN') {
      const adminCount = await this.prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        throw new BadRequestException('The system must always keep at least one active ADMIN');
      }
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
