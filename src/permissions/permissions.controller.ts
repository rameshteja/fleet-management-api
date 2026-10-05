import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiResponseMessage } from 'src/common/decorators/api-response.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionsController {
  constructor(
    private readonly permissionService: PermissionsService
  ) { }

  @Post()
  @Permissions('PERMISSION_CREATE')
  @ApiResponseMessage('Permission created successfully.')
  async create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  @Permissions('PERMISSION_VIWE')
  @ApiResponseMessage('Permission fetched successfully.')
  async findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Permissions('PERMISSION_VIEW')
  @ApiResponseMessage('Permission details fetched successfully.')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @Permissions('PERMISSION_UPDATE')
  @ApiResponseMessage('Permission updated successfully.')
  async udpate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePermissionDto
  ) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('PERMISSION_DELETE')
  @ApiResponseMessage('Permission deleted successfully.')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.permissionService.remove(id);
    return {
      data: null,
      metadata: []
    };
  }
}
