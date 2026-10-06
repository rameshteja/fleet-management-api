import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { UserEntity, UserStatus } from '../../users/entities/user.entity';
import { GroupEntity, GroupCode } from '../../groups/entities/group.entity';

const dataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),

  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'fleet_management',

  entities: ['src/**/*.entity.ts'],

  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  const groupRepository = dataSource.getRepository(GroupEntity);

  const userRepository = dataSource.getRepository(UserEntity);

  const group = await groupRepository.findOne({
    where: {
      code: GroupCode.SUPER_ADMIN,
    },
  });

  if (!group) {
    throw new Error(
      'SUPER_ADMIN group not found. Run npm run seed:rbac first.',
    );
  }

  const email = 'admin@fleetmanagement.com';

  const existingUser = await userRepository.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    console.log(`Super Admin already exists: ${email}`);

    await dataSource.destroy();
    return;
  }

  const password = 'Admin@12345';
  const phoneNumber = '+1234567890';

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = userRepository.create({
    firstName: 'Super',
    lastName: 'Admin',

    userName: 'superadmin',

    email,

    phoneNumber,

    password: hashedPassword,

    groupId: group.id,

    status: UserStatus.ACTIVE,

    isEmailVerified: true,

    isMobileVerified: true,
  });

  await userRepository.save(user);

  console.log('----------------------------------');
  console.log('Super Admin created successfully');
  console.log(`Email    : ${email}`);
  console.log(`Password : ${password}`);
  console.log(`Phone    : ${phoneNumber}`);
  console.log('----------------------------------');

  await dataSource.destroy();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
