import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from 'src/infrastructure/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    StorageModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
