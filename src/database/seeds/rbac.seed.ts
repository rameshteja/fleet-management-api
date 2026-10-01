import 'dotenv/config';
import { DataSource } from 'typeorm';

import { GroupEntity, GroupCode } from '../../groups/entities/group.entity';

import { RoleEntity } from '../../roles/entities/role.entity';

import { PermissionEntity } from '../../permissions/entities/permission.entity';

import { GroupRoleEntity } from '../../groups/entities/group-role.entity';

import { RolePermissionEntity } from '../../roles/entities/role-permission.entity';

import { AppDataSource } from '../data-source';

const permissions = [
  // Users
  {
    name: 'Create User',
    code: 'USER_CREATE',
    module: 'USERS',
  },
  {
    name: 'View User',
    code: 'USER_VIEW',
    module: 'USERS',
  },
  {
    name: 'Update User',
    code: 'USER_UPDATE',
    module: 'USERS',
  },
  {
    name: 'Delete User',
    code: 'USER_DELETE',
    module: 'USERS',
  },

  // Groups
  {
    name: 'Create Group',
    code: 'GROUP_CREATE',
    module: 'GROUPS',
  },
  {
    name: 'View Group',
    code: 'GROUP_VIEW',
    module: 'GROUPS',
  },
  {
    name: 'Update Group',
    code: 'GROUP_UPDATE',
    module: 'GROUPS',
  },
  {
    name: 'Delete Group',
    code: 'GROUP_DELETE',
    module: 'GROUPS',
  },

  // Roles
  {
    name: 'Create Role',
    code: 'ROLE_CREATE',
    module: 'ROLES',
  },
  {
    name: 'View Role',
    code: 'ROLE_VIEW',
    module: 'ROLES',
  },
  {
    name: 'Update Role',
    code: 'ROLE_UPDATE',
    module: 'ROLES',
  },
  {
    name: 'Delete Role',
    code: 'ROLE_DELETE',
    module: 'ROLES',
  },

  // Permissions
  {
    name: 'Create Permission',
    code: 'PERMISSION_CREATE',
    module: 'PERMISSIONS',
  },
  {
    name: 'View Permission',
    code: 'PERMISSION_VIEW',
    module: 'PERMISSIONS',
  },
  {
    name: 'Update Permission',
    code: 'PERMISSION_UPDATE',
    module: 'PERMISSIONS',
  },
  {
    name: 'Delete Permission',
    code: 'PERMISSION_DELETE',
    module: 'PERMISSIONS',
  },

  // Drivers
  {
    name: 'Create Driver',
    code: 'DRIVER_CREATE',
    module: 'DRIVERS',
  },
  {
    name: 'View Driver',
    code: 'DRIVER_VIEW',
    module: 'DRIVERS',
  },
  {
    name: 'Update Driver',
    code: 'DRIVER_UPDATE',
    module: 'DRIVERS',
  },
  {
    name: 'Delete Driver',
    code: 'DRIVER_DELETE',
    module: 'DRIVERS',
  },

  // Owners
  {
    name: 'Create Owner',
    code: 'OWNER_CREATE',
    module: 'OWNERS',
  },
  {
    name: 'View Owner',
    code: 'OWNER_VIEW',
    module: 'OWNERS',
  },
  {
    name: 'Update Owner',
    code: 'OWNER_UPDATE',
    module: 'OWNERS',
  },
  {
    name: 'Delete Owner',
    code: 'OWNER_DELETE',
    module: 'OWNERS',
  },

  // Companies
  {
    name: 'Create Company',
    code: 'COMPANY_CREATE',
    module: 'COMPANIES',
  },
  {
    name: 'View Company',
    code: 'COMPANY_VIEW',
    module: 'COMPANIES',
  },
  {
    name: 'Update Company',
    code: 'COMPANY_UPDATE',
    module: 'COMPANIES',
  },
  {
    name: 'Delete Company',
    code: 'COMPANY_DELETE',
    module: 'COMPANIES',
  },

  // Vehicles
  {
    name: 'Create Vehicle',
    code: 'VEHICLE_CREATE',
    module: 'VEHICLES',
  },
  {
    name: 'View Vehicle',
    code: 'VEHICLE_VIEW',
    module: 'VEHICLES',
  },
  {
    name: 'Update Vehicle',
    code: 'VEHICLE_UPDATE',
    module: 'VEHICLES',
  },
  {
    name: 'Delete Vehicle',
    code: 'VEHICLE_DELETE',
    module: 'VEHICLES',
  },

  // Trips
  {
    name: 'Create Trip',
    code: 'TRIP_CREATE',
    module: 'TRIPS',
  },
  {
    name: 'View Trip',
    code: 'TRIP_VIEW',
    module: 'TRIPS',
  },
  {
    name: 'Update Trip',
    code: 'TRIP_UPDATE',
    module: 'TRIPS',
  },
  {
    name: 'Delete Trip',
    code: 'TRIP_DELETE',
    module: 'TRIPS',
  },

  {
    name: 'View Reports',
    code: 'REPORT_VIEW',
    module: 'REPORTS',
  },
];

const groups = [
  {
    name: 'Super Admin',
    code: GroupCode.SUPER_ADMIN,
    description: 'System administrator with full system permissions.',
  },
  {
    name: 'Company',
    code: GroupCode.COMPANY,
    description: 'Company users who manage company operations.',
  },
  {
    name: 'Driver',
    code: GroupCode.DRIVER,
    description: 'Users who operate vehicles and trips.',
  },
  {
    name: 'Owner',
    code: GroupCode.OWNER,
    description: 'Vehicle or fleet owners.',
  },
];

const roles = [
  {
    name: 'Super Admin',
    code: 'SUPER_ADMIN',
    description: 'Full system access.',
  },
  {
    name: 'Company Admin',
    code: 'COMPANY_ADMIN',
    description: 'Manage company operations.',
  },
  {
    name: 'Driver',
    code: 'DRIVER',
    description: 'Driver operations.',
  },
  {
    name: 'Owner',
    code: 'OWNER',
    description: 'Owner operations.',
  },
];

async function seed() {
  const dataSource: DataSource = AppDataSource;

  await dataSource.initialize();

  const groupRepository = dataSource.getRepository(GroupEntity);

  const roleRepository = dataSource.getRepository(RoleEntity);

  const permissionRepository = dataSource.getRepository(PermissionEntity);

  const groupRoleRepository = dataSource.getRepository(GroupRoleEntity);

  const rolePermissionRepository =
    dataSource.getRepository(RolePermissionEntity);

  // --------------------------------
  // Groups
  // --------------------------------

  const groupMap = new Map<string, GroupEntity>();

  for (const groupData of groups) {
    let group = await groupRepository.findOne({
      where: {
        code: groupData.code,
      },
    });

    if (!group) {
      group = await groupRepository.save(groupRepository.create(groupData));
    }

    groupMap.set(group.code, group);
  }

  // --------------------------------
  // Roles
  // --------------------------------

  const roleMap = new Map<string, RoleEntity>();

  for (const roleData of roles) {
    let role = await roleRepository.findOne({
      where: {
        code: roleData.code,
      },
    });

    if (!role) {
      role = await roleRepository.save(roleRepository.create(roleData));
    }

    roleMap.set(role.code, role);
  }

  // --------------------------------
  // Permissions
  // --------------------------------

  const permissionMap = new Map<string, PermissionEntity>();

  for (const permissionData of permissions) {
    let permission = await permissionRepository.findOne({
      where: {
        code: permissionData.code,
      },
    });

    if (!permission) {
      permission = await permissionRepository.save(
        permissionRepository.create(permissionData),
      );
    }

    permissionMap.set(permission.code, permission);
  }

  // --------------------------------
  // Group -> Role
  // --------------------------------

  const groupRoleMappings = [
    {
      group: GroupCode.SUPER_ADMIN,
      role: 'SUPER_ADMIN',
    },
    {
      group: GroupCode.COMPANY,
      role: 'COMPANY_ADMIN',
    },
    {
      group: GroupCode.DRIVER,
      role: 'DRIVER',
    },
    {
      group: GroupCode.OWNER,
      role: 'OWNER',
    },
  ];

  for (const mapping of groupRoleMappings) {
    const group = groupMap.get(mapping.group);

    const role = roleMap.get(mapping.role);

    if (!group || !role) {
      throw new Error(
        `Missing group or role for ${mapping.group} -> ${mapping.role}`,
      );
    }

    const existing = await groupRoleRepository.findOne({
      where: {
        groupId: group.id,
        roleId: role.id,
      },
    });

    if (!existing) {
      await groupRoleRepository.save(
        groupRoleRepository.create({
          groupId: group.id,
          roleId: role.id,
        }),
      );
    }
  }

  // --------------------------------
  // Super Admin permissions
  // --------------------------------

  const superAdminPermissionCodes = permissions.map(
    (permission) => permission.code,
  );

  const superAdminRole = roleMap.get('SUPER_ADMIN');

  if (!superAdminRole) {
    throw new Error('SUPER_ADMIN role not found.');
  }

  for (const permissionCode of superAdminPermissionCodes) {
    const permission = permissionMap.get(permissionCode);

    if (!permission) {
      throw new Error(`Permission ${permissionCode} not found.`);
    }

    const existing = await rolePermissionRepository.findOne({
      where: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });

    if (!existing) {
      await rolePermissionRepository.save(
        rolePermissionRepository.create({
          roleId: superAdminRole.id,
          permissionId: permission.id,
        }),
      );
    }
  }

  console.log('RBAC seed completed successfully.');

  await dataSource.destroy();
}

seed().catch(async (error) => {
  console.error('RBAC seed failed:', error);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  process.exit(1);
});
