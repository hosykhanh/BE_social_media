import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import { ChatRoomDto } from 'src/dto/chatRoom.dto';
import { ChatRoom } from 'src/models/chatRoom.model';

@Controller('chatRooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  async createChatRoom(@Body() chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomService.createChatRoom(chatRoomDto);
  }

  @Post('private')
  async createPrivateChatRoom(
    @Body('userId') userId: string,
    @Body('otherUserId') otherUserId: string,
  ): Promise<ChatRoom> {
    return await this.chatRoomService.createPrivateChatRoom(
      userId,
      otherUserId,
    );
  }

  @Post(':id/addUsers')
  async addUsersToChatRoom(
    @Param('id') chatRoomId: string,
    @Body('userIds') userIds: string[],
  ): Promise<ChatRoom> {
    return await this.chatRoomService.addUsersToChatRoom(chatRoomId, userIds);
  }

  @Get()
  async findAll(): Promise<ChatRoom[]> {
    return this.chatRoomService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ChatRoom> {
    return this.chatRoomService.findById(id);
  }

  @Get('user/:userId')
  async getChatRoomsByUserId(@Param('userId') userId: string) {
    const chatRooms = await this.chatRoomService.findChatRoomsByUserId(userId);
    return chatRooms;
  }

  @Put(':id')
  async updateChatRoom(
    @Param('id') id: string,
    @Body() chatRoomDto: ChatRoomDto,
  ): Promise<ChatRoom> {
    return this.chatRoomService.updateChatRoom(id, chatRoomDto);
  }

  @Put(':id/participants')
  async addParticipant(
    @Param('id') chatRoomId: string,
    @Body('userId') userId: string,
  ): Promise<ChatRoom> {
    return this.chatRoomService.addParticipant(chatRoomId, userId);
  }

  @Delete(':id')
  async deleteChatRoom(@Param('id') id: string): Promise<ChatRoom> {
    return this.chatRoomService.deleteChatRoom(id);
  }
}
