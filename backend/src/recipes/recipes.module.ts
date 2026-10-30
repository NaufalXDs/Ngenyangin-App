import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service.js';
import { RecipesController } from './recipes.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, PrismaService],
})
export class RecipesModule {}
