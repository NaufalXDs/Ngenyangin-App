import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(idStr: string, newRole: string, currentUser: any) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can update user roles');
    }

    const id = Number(idStr);
    if (id === Number(currentUser.id)) {
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
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async deleteUser(idStr: string, currentUser: any) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can delete users');
    }

    const id = Number(idStr);
    if (id === Number(currentUser.id)) {
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
