import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from 'src/models/message.model';
import { CreateMessageDto } from 'src/dto/message.dto';
import { JwtAuthService } from '../auth/jwt.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Headers('authorization') authHeader: string,
  ): Promise<Message> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.messageService.createMessage(createMessageDto);
  }

  @Get(':chatRoomId')
  async findAllMessages(
    @Param('chatRoomId') chatRoomId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Message[]> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.messageService.findAllMessages(chatRoomId);
  }

  @Delete(':id')
  async deleteMessage(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Message | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.messageService.deleteMessage(id);
  }

  @Delete('/chatRoom/:chatRoomId')
  async deleteMessagesByChatRoom(
    @Param('chatRoomId') chatRoomId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{ deletedCount: number }> {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    return this.messageService.deleteMessagesByChatRoom(chatRoomId);
  }
}
