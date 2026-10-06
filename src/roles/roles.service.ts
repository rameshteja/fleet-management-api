import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,

    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const code = dto.code.trim().toUpperCase();
    const exists = await this.roleRepository.findOne({
      where: {
        code,
      },
    });

    if (exists) {
      throw new ConflictException('Role code already exists.');
    }
    const role = this.roleRepository.create({
      ...dto,
      name: dto.name.trim(),
      code,
    });
    return await this.roleRepository.save(role);
  }
  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }
    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);
    if (dto.code && dto.code.trim().toUpperCase() !== role.code) {
      const code = dto.code?.trim().toUpperCase();
      const exists = await this.roleRepository.findOne({
        where: {
          code,
        },
      });
      if (exists && exists.id !== id) {
        throw new ConflictException('Role already exists.');
      }
      role.code = code;
    }
    if (dto.name !== undefined) {
      role.name = dto.name.trim();
    }
    if (dto.description?.trim() !== undefined) {
      role.description = dto.description.trim();
    }
    return await this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.roleRepository.delete({ id });
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    await this.findOne(roleId);
    const permissions = await this.permissionRepository.find({
      where: {
        id: In(permissionIds),
      },
    });
    if (permissions.length == permissionIds.length) {
      throw new NotFoundException('One or more permissions were not found.');
    }
    await this.rolePermissionRepository.delete({ roleId });
    const mappings = permissionIds.map((permissionId) =>
      this.rolePermissionRepository.create({
        roleId,
        permissionId,
      }),
    );
    await this.rolePermissionRepository.save(mappings);
  }

  async getPermissions(roleId: string) {
    await this.findOne(roleId);
    return this.rolePermissionRepository.find({
      where: {
        roleId,
      },
      relations: {
        permission: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
