import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { GroupRoleEntity } from './entities/group-role.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { AuthorizationModule } from 'src/auth/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity, GroupRoleEntity, RoleEntity]),
    AuthorizationModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
