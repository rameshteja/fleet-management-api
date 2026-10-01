import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
export enum GroupCode {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY = 'COMPANY',
  DRIVER = 'DRIVER',
  OWNER = 'OWNER',
}

export enum GroupStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'varchar', length: 100, unique: true })
  code: GroupCode;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({
    type: 'enum',
    enum: GroupStatus,
    default: GroupStatus.ACTIVE,
  })
  status: GroupStatus;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;
}
