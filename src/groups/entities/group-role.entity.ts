import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GroupEntity } from './group.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('group_roles')
@Unique('UQ_group_roles_group_role', ['groupId', 'roleId'])
export class GroupRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'group_id',
    type: 'uuid',
  })
  groupId: string;

  @Column({
    name: 'role_id',
    type: 'uuid',
  })
  roleId: string;

  @ManyToOne(() => GroupEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'group_id',
  })
  group: GroupEntity;

  @ManyToOne(() => RoleEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role_id',
  })
  role: RoleEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;
}
