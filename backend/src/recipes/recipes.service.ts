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
        author: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMine(userId: string) {
    return this.prisma.recipe.findMany({
      where: { authorId: userId },
      include: {
        author: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: { title: string; description?: string; ingredients: string; instructions: string; category?: string; imageUrl?: string }, user: any) {
    if (!dto.title || !dto.ingredients || !dto.instructions) {
      throw new BadRequestException('Title, ingredients, and instructions are required');
    }

    const status = user.role === 'ADMIN' || user.role === 'REVIEWER' ? 'APPROVED' : 'PENDING';
    const baseSlug = dto.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const slug = `${baseSlug || 'recipe'}-${Math.random().toString(36).substring(2, 7)}`;

    return this.prisma.recipe.create({
      data: {
        title: dto.title.trim(),
        slug,
        description: dto.description?.trim() || '',
        ingredients: dto.ingredients.trim(),
        instructions: dto.instructions.trim(),
        category: dto.category?.trim() || 'Main Course',
        imageUrl: dto.imageUrl?.trim() || null,
        status,
        authorId: user.id,
      },
      include: {
        author: { select: { id: true, username: true, name: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, username: true, name: true } },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  async moderate(idStr: string, status: string, rejectionReason: string | undefined, user: any) {
    if (user.role !== 'ADMIN' && user.role !== 'REVIEWER') {
      throw new ForbiddenException('Only admin and reviewers can moderate recipes');
    }

    if (!['APPROVED', 'PENDING', 'REJECTED'].includes(status)) {
      throw new BadRequestException('Invalid moderation status. Must be APPROVED, PENDING, or REJECTED');
    }

    if (status === 'REJECTED' && (!rejectionReason || !rejectionReason.trim())) {
      throw new BadRequestException('Rejection reason is required when rejecting a recipe');
    }

    const id = idStr;
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.prisma.recipe.update({
      where: { id },
      data: {
        status: status as any,
        rejectionReason: status === 'REJECTED' && rejectionReason ? rejectionReason.trim() : null,
      },
      include: { author: { select: { id: true, username: true, name: true } } },
    });
  }

  async update(
    idStr: string,
    dto: {
      title?: string;
      category?: string;
      description?: string;
      imageUrl?: string;
      ingredients?: string;
      instructions?: string;
    },
    user: any,
  ) {
    const id = idStr;
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only edit your own recipes unless you are admin');
    }

    let slug = recipe.slug;
    if (dto.title && dto.title.trim() && dto.title.trim() !== recipe.title) {
      const baseSlug = dto.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      slug = `${baseSlug || 'recipe'}-${Math.random().toString(36).substring(2, 7)}`;
    }

    // Moderation rule: If regular user edits an APPROVED or REJECTED recipe, reset status to PENDING for review and clear rejection reason
    let status = recipe.status;
    let rejectionReason = recipe.rejectionReason;
    if (user.role !== 'ADMIN' && (recipe.status === 'APPROVED' || recipe.status === 'REJECTED')) {
      status = 'PENDING' as any;
      rejectionReason = null;
    }

    return this.prisma.recipe.update({
      where: { id },
      data: {
        title: dto.title?.trim() ?? recipe.title,
        slug,
        category: dto.category?.trim() ?? recipe.category,
        description: dto.description !== undefined ? dto.description.trim() : recipe.description,
        imageUrl: dto.imageUrl !== undefined ? (dto.imageUrl.trim() || null) : recipe.imageUrl,
        ingredients: dto.ingredients?.trim() ?? recipe.ingredients,
        instructions: dto.instructions?.trim() ?? recipe.instructions,
        status,
        rejectionReason,
      },
      include: {
        author: { select: { id: true, username: true, name: true } },
      },
    });
  }

  async remove(idStr: string, user: any) {
    const id = idStr;
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own recipes unless you are admin');
    }

    await this.prisma.recipe.delete({ where: { id } });
    return { message: 'Recipe deleted successfully' };
  }
}
