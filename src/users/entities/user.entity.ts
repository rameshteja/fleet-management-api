import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECLINED = 'DECLINED',
  TEMPORARY_BLOCKED = 'TEMPORARY_BLOCKED',
  PERMANENT_BLOCKED = 'PERMANENT_BLOCKED',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
  })
  lastName: string;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  userName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
  })
  phoneNumber: string;

  @Column({
    name: 'dob',
    type: 'date',
    nullable: true,
  })
  dob: Date;

  @Column({
    name: 'profile_image',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profileImage: string;

  @Column({
    name: 'group_id',
    type: 'uuid',
  })
  groupId: string;

  @Column({
    name: 'is_email_verified',
    type: 'boolean',
    default: false,
  })
  isEmailVerified: boolean;

  @Column({
    name: 'is_mobile_verified',
    type: 'boolean',
    default: false,
  })
  isMobileVerified: boolean;

  @Column({
    name: 'address',
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city: string;

  @Column({
    name: 'state_id',
    type: 'uuid',
    nullable: true,
  })
  stateId: string;

  @Column({
    name: 'country_id',
    type: 'uuid',
    nullable: true,
  })
  countryId: string;

  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: true,
  })
  createdBy: string;

  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
  })
  updatedBy: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Column({
    name: 'last_access_at',
    type: 'timestamptz',
    nullable: true,
  })
  lastAccessAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;
}