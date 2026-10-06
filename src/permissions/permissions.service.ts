import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const code = dto.code.trim().toUpperCase();
    const exists = await this.permissionRepository.findOne({ where: { code } });
    if (exists) {
      throw new ConflictException('Permission code already exists.');
    }
    const permission = this.permissionRepository.create({
      ...dto,
      name: dto.name.trim(),
      code,
    });
    return await this.permissionRepository.save(permission);
  }

  async findAll(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({
      where: {
        id,
      },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found.');
    }
    return permission;
  }

  async update(
    id: string,
    dto: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.findOne(id);

    if (dto.code && dto.code.trim().toUpperCase() !== permission.code) {
      const code = dto.code.trim().toUpperCase();
      const existing = await this.permissionRepository.findOne({
        where: {
          code,
        },
      });
      if (existing && existing.id != id) {
        throw new ConflictException('Permission code already exists');
      }
      permission.code = code;
    }
    if (dto.name !== undefined) {
      permission.name = dto.name.trim();
    }

    if (dto.description !== undefined) {
      permission.description = dto.description.trim();
    }
    return await this.permissionRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.permissionRepository.delete({ id });
  }
}
