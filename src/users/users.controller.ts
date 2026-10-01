import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  API_RESPONSE_MESSAGE,
  ApiResponseMessage,
} from 'src/common/decorators/api-response.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  AuthenticatedUser,
} from 'src/common/decorators/current-user.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get()
  @Permissions('USER_VIEW')
  @ApiResponseMessage('Users fetched successfully.')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @Permissions('USER_VIEW')
  @ApiResponseMessage('User fetched successfully.')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserEntity | null> {
    return this.userService.findById(id);
  }

  @Post()
  @Permissions('USER_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseMessage('User created successfully.')
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser('id') createdBy: string,
  ) {
    return this.userService.create(createUserDto, createdBy);
  }

  @Patch(':id')
  @Permissions('USER_UPDATE')
  @ApiResponseMessage('User updated successfully.')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.userService.update(id, updateUserDto, currentUserId);
  }

  @Delete(':id')
  @Permissions('USER_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponseMessage('User deleted successfully.')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponseMessage('Profile image uploaded successfully.')
  async uploadProfileImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /^(image\/jpeg|image\/png|image\/webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadProfileImage(id, file);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiResponseMessage('Profile fetched successfully.')
  async findMyProfile(
    @CurrentUser('id') id: string,
  ): Promise<UserEntity | null> {
    return this.userService.getCurrentUser(id);
  }
}
