import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PermissionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PermissionStatus,
    default: PermissionStatus.ACTIVE,
  })
  status: PermissionStatus;

  @CreateDateColumn({ name: 'create_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
