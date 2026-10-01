import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Entity('role_permissions')
@Unique('UQ_role_permissions_role_permission', ['roleId', 'permissionId'])
export class RolePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    name: 'role_id',
    type: 'uuid',
  })
  roleId: string;
  @Column({
    name: 'permission_id',
    type: 'uuid',
  })
  permissionId: string;
  @ManyToOne(() => RoleEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role_id',
  })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'permission_id',
  })
  permission: PermissionEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;
}
