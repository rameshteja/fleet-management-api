import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoleStatus } from '../roles/entities/role.entity';
import { PermissionStatus } from '../permissions/entities/permission.entity';

@Injectable()
export class AuthorizationService {
  constructor(private readonly dataSource: DataSource) {}

  async hasPermission(
    groupId: string,
    permissionCode: string,
  ): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('permission.id', 'permission_id')
      .from('permissions', 'permission')

      .innerJoin(
        'role_permissions',
        'role_permission',
        'role_permission.permission_id = permission.id',
      )

      .innerJoin('roles', 'role', 'role.id = role_permission.role_id')

      .innerJoin('group_roles', 'group_role', 'group_role.role_id = role.id')

      .where('group_role.group_id = :groupId', {
        groupId,
      })

      .andWhere('permission.code = :permissionCode', {
        permissionCode,
      })

      .andWhere('permission.status = :permissionStatus', {
        permissionStatus: PermissionStatus.ACTIVE,
      })

      .andWhere('role.status = :roleStatus', { roleStatus: RoleStatus.ACTIVE })

      .getRawOne<{ permission_id: string }>();

    return !!result;
  }
}
