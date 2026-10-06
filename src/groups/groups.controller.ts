import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponseMessage } from 'src/common/decorators/api-response.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AssignRoleDto } from './dto/assign-roles.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Post()
  @Permissions('GROUP_CREATE')
  @ApiResponseMessage('Group created successfully.')
  async create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto);
  }

  @Get()
  @Permissions('GROUP_VIEW')
  @ApiResponseMessage('Group data found.')
  async findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @Permissions('GROUP_VIEW')
  @ApiResponseMessage('Group details found.')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @Permissions('GROUP_UPDATE')
  @ApiResponseMessage('Group updated suucessfully.')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, dto);
  }
  @Delete(':id')
  @Permissions('GROUP_DELETE')
  @ApiResponseMessage('Group deleted successfully.')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.groupService.remove(id);
    return {
      data: null,
      metadata: {},
    };
  }

  @Put(':id/roles')
  @Permissions('GROUP_UPDATE')
  @ApiResponseMessage('Group roles updated successfully.')
  async assignRoles(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignRoleDto,
  ) {
    await this.groupService.assignRole(id, dto.roleIds);
    return {
      data: null,
      metadata: {},
    };
  }

  @Get(':id/roles')
  @Permissions('GROUP_VIEW')
  @ApiResponseMessage('Group roles fetched successfully.')
  async getRoles(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.groupService.getRoles(id);
  }
}
