import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponseMessage } from 'src/common/decorators/api-response.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
  constructor(
    private readonly roleService: RolesService
  ) { }

  @Post()
  @Permissions('ROLE_CREATE')
  @ApiResponseMessage('Role created successfully.')
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  @Permissions('ROLE_VIEW')
  @ApiResponseMessage('Roles fetched successfully.')
  async findAll() {
    return this.roleService.findAll();

  }

  @Get(':id')
  @Permissions('ROLE_VIEW')
  @ApiResponseMessage('Role fetched successfully.')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Permissions('ROLE_UPDATE')
  @ApiResponseMessage('Role updated successfully.')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }
  @Delete(':id')
  @Permissions('ROLE_DELETE')
  @ApiResponseMessage('Role deleted successfully.')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.roleService.remove(id);
    return {
      data: null, metadata: {}
    }
  }

  @Get(':id/permissions')
  @Permissions('ROLE_VIEW')
  @ApiResponseMessage('Role permissions fetched successfully.')
  async getPermissions(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roleService.getPermissions(id);
  }

  @Put(':id/permissions')
  @Permissions('ROLE_UPDATE')
  @ApiResponseMessage('Role permissions updated successfully.')
  async assignPermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignPermissionsDto
  ) {
    await this.roleService.assignPermissions(id, dto.permissions);
    return {
      data: null,
      metadata: {}
    }
  }
}
