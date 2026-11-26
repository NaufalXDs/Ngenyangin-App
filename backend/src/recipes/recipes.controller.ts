import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import jwt from 'jsonwebtoken';
import { RecipesService } from './recipes.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @SkipThrottle()
  @Get()
  async findAll(@Query('status') status: string, @Req() req: any) {
    // Optional bearer token extraction for reviewer/admin filtered queries
    let user = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        user = jwt.verify(token, process.env.JWT_SECRET || 'ngenyangin_secret_key');
      } catch (e) {
        // invalid token ignored for public get
      }
    }
    return this.recipesService.findAll(status, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async findMine(@Req() req: any) {
    return this.recipesService.findMine(req.user.id);
  }

  @SkipThrottle()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.recipesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { title: string; description: string; ingredients: string; instructions: string; category?: string; imageUrl?: string }, @Req() req: any) {
    return this.recipesService.create(body, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'REVIEWER')
  @Patch(':id/moderate')
  async moderate(@Param('id') id: string, @Body() body: { status: string; rejectionReason?: string }, @Req() req: any) {
    return this.recipesService.moderate(id, body.status, body.rejectionReason, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; ingredients?: string; instructions?: string; category?: string; imageUrl?: string },
    @Req() req: any,
  ) {
    return this.recipesService.update(id, body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.recipesService.remove(id, req.user);
  }
}
