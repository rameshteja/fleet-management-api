import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupCode, GroupEntity } from './entities/group.entity';
import { In, Repository } from 'typeorm';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { GroupRoleEntity } from './entities/group-role.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,

    @InjectRepository(RoleEntity)
    private readonly RoleRepository: Repository<RoleEntity>,

    @InjectRepository(GroupRoleEntity)
    private readonly groupRoleRepository: Repository<GroupRoleEntity>,
  ) {}

  async create(dto: CreateGroupDto): Promise<GroupEntity> {
    const code = dto.code.trim().toUpperCase() as GroupCode;
    const exists = await this.groupRepository.findOne({
      where: {
        code,
      },
    });
    if (exists) {
      throw new ConflictException('Group code already exists.');
    }
    const group = this.groupRepository.create({
      ...dto,
      name: dto.name.trim(),
      code,
    });
    return await this.groupRepository.save(group);
  }
  async findAll(): Promise<GroupEntity[]> {
    return await this.groupRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
  async findOne(id: string): Promise<GroupEntity> {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException('Group Not found.');
    }
    return group;
  }

  async update(id: string, dto: UpdateGroupDto) {
    const group = await this.findOne(id);
    if (dto.code && (dto.code.trim() as GroupCode) !== group.code) {
      const code = dto.code.trim() as GroupCode;
      const exists = await this.groupRepository.findOne({
        where: { code },
      });
      if (exists && exists.id !== id) {
        throw new ConflictException('Group code already exists');
      }
      group.code = code;
    }
    if (dto.name?.trim() !== undefined) {
      group.name = dto.name.trim();
    }
    if (dto.description?.trim() !== undefined) {
      group.description = dto.description.trim();
    }
    await this.groupRepository.save(group);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.groupRepository.delete(id);
  }

  async assignRole(groupId: string, roleIds: string[]): Promise<void> {
    await this.findOne(groupId);
    const roles = await this.RoleRepository.find({
      where: {
        id: In(roleIds),
      },
    });
    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles were not found.');
    }
    await this.groupRoleRepository.delete({ groupId });
    const mappings = roleIds.map((roleId) =>
      this.groupRoleRepository.create({
        groupId,
        roleId,
      }),
    );
    await this.groupRoleRepository.save(mappings);
  }

  async getRoles(groupId: string) {
    await this.findOne(groupId);
    return this.groupRoleRepository.find({
      where: {
        groupId,
      },
      relations: {
        role: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
