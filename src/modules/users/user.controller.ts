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
  Query,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { JwtAuthService } from '../login/jwt.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('upload-file-excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
  ) {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Sử dụng header: 1 để lấy dữ liệu dạng mảng
      const dataChat = await this.userService.createUsersFromExcel(data);
      return {
        status: 'success',
        message: 'Users and group chat created successfully!',
        data: dataChat,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'An error occurred during file processing!',
      };
    }
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.userService.findById(id);
  }

  @Get('byEmail/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  @Get(':id/suggestions')
  async searchUsers(
    @Param('id') id: string,
    @Query('search') search: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User[]> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.userService.searchUsers(id, search);
  }

  @Get(':id/sent-requests')
  async getSentRequests(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User[]> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.userService.getSentFriendRequests(id);
  }

  @Get('friend-suggestions/:userId')
  async getFriendSuggestions(
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{
    status: string;
    message: string;
    data: { user: User; mutualFriendsCount: number }[];
  }> {
    await this.jwtAuthService.checkRole(authHeader, 'user', userId);
    const suggestions = await this.userService.getFriendSuggestions(userId);
    return {
      status: 'OK',
      message: 'Friend suggestions retrieved successfully',
      data: suggestions,
    };
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; data: User | null }> {
    await this.jwtAuthService.checkRole(authHeader, 'user', id);
    const data = await this.userService.updateUser(id, updateUserDto);
    return {
      status: 'OK',
      message: 'Update successful',
      data,
    };
  }

  @Put(':id/friends')
  async addFriend(
    @Param('id') id: string,
    @Body('friendId') friendId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return await this.userService.addFriend(id, friendId);
  }

  @Put(':id/friends/request')
  async addFriendRequest(
    @Param('id') id: string,
    @Body('friendId') friendId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return await this.userService.addFriendRequest(id, friendId);
  }

  @Put(':id/friends/accept')
  async acceptFriendRequest(
    @Param('id') id: string,
    @Body('friendId') friendId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user', id);
    return await this.userService.acceptFriendRequest(id, friendId);
  }

  @Put(':id/friends/reject')
  async rejectFriendRequest(
    @Param('id') id: string,
    @Body('friendId') friendId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user', id);
    return await this.userService.rejectFriendRequest(id, friendId);
  }

  @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user', id);
    return await this.userService.updateAvatar(id, file);
  }

  @Delete('delete-many')
  async deleteManyUser(
    @Body('ids') ids: string[],
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; deletedCount: number }> {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    const result = await this.userService.deleteManyUser(ids);
    const deletedCount = result.deletedCount;
    return {
      status: 'OK',
      message: 'Delete successful',
      deletedCount,
    };
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; data: User | null }> {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    const data = await this.userService.deleteUser(id);
    if (data) {
      return {
        status: 'OK',
        message: `User with ID ${id} deleted successfully`,
        data,
      };
    } else {
      return {
        status: 'NOT_FOUND',
        message: `User with ID ${id} not found`,
        data: null,
      };
    }
  }

  @Delete(':id/friends')
  async removeFriend(
    @Param('id') id: string,
    @Body('friendId') friendId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user', id);
    return await this.userService.removeFriend(id, friendId);
  }

  @Put(':id/friends/delete-request')
  async deleteSentFriendRequest(
    @Param('id') id: string,
    @Body('friendId') friendId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<User | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user', id);
    return await this.userService.deleteSentFriendRequest(id, friendId);
  }
}
