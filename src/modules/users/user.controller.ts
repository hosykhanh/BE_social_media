import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';
import { UpdateUserDto } from 'src/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Get('byEmail/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ status: string; message: string; data: User | null }> {
    const data = await this.userService.updateUser(id, updateUserDto);
    return {
      status: 'OK',
      message: 'Update successful',
      data,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User | null> {
    return this.userService.deleteUser(id);
  }

  @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User | null> {
    return await this.userService.updateAvatar(id, file);
  }
}
