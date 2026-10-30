import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async findAll(statusQuery?: string, user?: any) {
    let statusFilter: any = 'APPROVED';

    if (statusQuery) {
      if (statusQuery === 'PENDING' || statusQuery === 'REJECTED') {
        if (!user || (user.role !== 'ADMIN' && user.role !== 'REVIEWER')) {
          throw new ForbiddenException('Only admin and reviewers can view pending or rejected recipes');
        }
        statusFilter = statusQuery;
      } else if (statusQuery === 'ALL') {
        if (!user || (user.role !== 'ADMIN' && user.role !== 'REVIEWER')) {
          throw new ForbiddenException('Only admin and reviewers can view all recipes');
        }
        statusFilter = undefined;
      }
    }

    const where = statusFilter ? { status: statusFilter } : {};

    return this.prisma.recipe.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: { title: string; description?: string; ingredients: string; instructions: string; category?: string }, user: any) {
    if (!dto.title || !dto.ingredients || !dto.instructions) {
      throw new BadRequestException('Title, ingredients, and instructions are required');
    }

    const status = user.role === 'ADMIN' || user.role === 'REVIEWER' ? 'APPROVED' : 'PENDING';

    return this.prisma.recipe.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim() || '',
        ingredients: dto.ingredients.trim(),
        instructions: dto.instructions.trim(),
        category: dto.category?.trim() || 'Makanan Utama',
        status,
        authorId: Number(user.id),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async moderate(idStr: string, status: string, user: any) {
    if (user.role !== 'ADMIN' && user.role !== 'REVIEWER') {
      throw new ForbiddenException('Only admin and reviewers can moderate recipes');
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      throw new BadRequestException('Invalid moderation status. Must be APPROVED or REJECTED');
    }

    const id = Number(idStr);
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.prisma.recipe.update({
      where: { id },
      data: { status: status as any },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }

  async remove(idStr: string, user: any) {
    const id = Number(idStr);
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId !== Number(user.id) && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own recipes unless you are admin');
    }

    await this.prisma.recipe.delete({ where: { id } });
    return { message: 'Recipe deleted successfully' };
  }
}
