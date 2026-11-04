import { Controller, Get, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  async findAllUsers(@Req() req: any) {
    return this.adminService.findAllUsers(req.user);
  }

  @Patch('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body() body: { role: string }, @Req() req: any) {
    return this.adminService.updateUserRole(id, body.role, req.user);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    return this.adminService.deleteUser(id, req.user);
  }
}
