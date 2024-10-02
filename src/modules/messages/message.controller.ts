import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from 'src/models/message.model';
import { CreateMessageDto } from 'src/dto/message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messageService.createMessage(createMessageDto);
  }

  @Get(':chatRoomId')
  async findAllMessages(
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<Message[]> {
    return this.messageService.findAllMessages(chatRoomId);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string): Promise<Message | null> {
    return this.messageService.deleteMessage(id);
  }

  @Delete('/chatRoom/:chatRoomId')
  async deleteMessagesByChatRoom(
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<{ deletedCount: number }> {
    return this.messageService.deleteMessagesByChatRoom(chatRoomId);
  }
}
