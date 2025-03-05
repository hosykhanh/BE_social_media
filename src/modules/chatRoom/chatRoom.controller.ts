import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import { ChatRoomDto } from 'src/dto/chatRoom.dto';
import { ChatRoom } from 'src/models/chatRoom.model';
import { JwtAuthService } from '../auth/jwt.service';

@Controller('chatRooms')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post()
  async createChatRoom(
    @Body() chatRoomDto: ChatRoomDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.chatRoomService.createChatRoom(chatRoomDto);
  }

  @Post('private')
  async createPrivateChatRoom(
    @Body('userId') userId: string,
    @Body('otherUserId') otherUserId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return await this.chatRoomService.createPrivateChatRoom(
      userId,
      otherUserId,
    );
  }

  @Post(':id/addUsers')
  async addUsersToChatRoom(
    @Param('id') chatRoomId: string,
    @Body('userIds') userIds: string[],
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return await this.chatRoomService.addUsersToChatRoom(chatRoomId, userIds);
  }

  @Get()
  async findAll(
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom[]> {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    return this.chatRoomService.findAll();
  }

  @Get('groups')
  async findAllGroupChats(
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom[]> {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    return this.chatRoomService.findAllGroupChats();
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.chatRoomService.findById(id);
  }

  @Get('user/:userId')
  async getChatRoomsByUserId(
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ) {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    const chatRooms = await this.chatRoomService.findChatRoomsByUserId(userId);
    return chatRooms;
  }

  @Put(':id')
  async updateChatRoom(
    @Param('id') id: string,
    @Body() chatRoomDto: ChatRoomDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.chatRoomService.updateChatRoom(id, chatRoomDto);
  }

  @Put(':id/participants')
  async addParticipant(
    @Param('id') chatRoomId: string,
    @Body('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ChatRoom> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.chatRoomService.addParticipant(chatRoomId, userId);
  }

  @Delete(':id')
  async deleteChatRoom(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; result: ChatRoom | null }> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    const result = await this.chatRoomService.deleteChatRoom(id);
    return {
      status: 'OK',
      message: 'Delete successful',
      result,
    };
  }

  @Delete('delete-many')
  async deleteManyChatRooms(
    @Body('ids') ids: string[],
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; deletedCount: number }> {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('IDs array is required and cannot be empty');
    }
    const result = await this.chatRoomService.deleteManyChatRoom(ids);
    const deletedCount = result.deletedCount;
    return {
      status: 'OK',
      message: 'Delete successful',
      deletedCount,
    };
  }
}
