import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { promises } from 'dns';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { calculatePagination } from 'src/common/utils/pagination.util';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { StorageService } from '../infrastructure/storage/storage.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject('STORAGE_SERVICE')
    private readonly storageService: StorageService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const [users, totalRecords] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const metadata = calculatePagination(page, limit, totalRecords);

    return {
      data: users,
      metadata,
    };
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(
    createUserDto: CreateUserDto,
    createdBy: string,
  ): Promise<UserEntity> {
    const { groupId, ...userData } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: [
        {
          email: createUserDto.email.toLowerCase(),
        },
        {
          userName: createUserDto.userName,
        },
      ],
      withDeleted: true,
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists.');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = this.userRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLocaleLowerCase(),
      password: hashedPassword,
      createdBy: createdBy,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto, updatedBy: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('user not found.');
    }
    if (dto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists.');
      }
      user.email = dto.email.toLowerCase();
    }
    if (dto.userName) {
      const existingUser = await this.userRepository.findOne({
        where: { userName: dto.userName },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username already exists.');
      }
      user.userName = dto.userName;
    }

    Object.assign(user, {
      ...dto,
      ...(dto.email
        ? {
            email: dto.email.toLowerCase(),
          }
        : {}),
      updatedBy,
    });
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.userRepository.softDelete(id);
  }

  async uploadProfileImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const oldProfileImage = user.profileImage;

    const newProfileImage = await this.storageService.upload(file, 'users');

    user.profileImage = newProfileImage;

    const updatedUser = await this.userRepository.save(user);

    if (oldProfileImage) {
      await this.storageService.delete(oldProfileImage);
    }

    return updatedUser;
  }

  async getCurrentUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
