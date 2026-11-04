import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Roles('ADMIN')
  @Post()
  async createUser(@Body() body: { name: string; email: string; password: string; role?: string }) {
    return this.usersService.createUser(body);
  }

  @Roles('USER', 'REVIEWER', 'ADMIN')
  @Patch('me')
  async updateProfile(@Body() body: { name?: string; email?: string; currentPassword?: string; newPassword?: string }, @Req() req: any) {
    return this.usersService.updateProfile(Number(req.user.id), body);
  }

  @Roles('ADMIN')
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.usersService.updateRole(id, body.role);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
