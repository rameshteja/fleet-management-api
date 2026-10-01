import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { AuthModule } from '../auth/auth.module';
import { GroupRoleEntity } from './entities/group-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, GroupRoleEntity])],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
