import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from 'src/dto/message.dto';
import { Message } from 'src/models/message.model';
import { ChatGateway } from '../chatSocket/chat.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    private readonly chatGateway: ChatGateway, // Inject ChatGateway to emit events
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    // Tạo và lưu tin nhắn mới vào cơ sở dữ liệu
    const createdMessage = await new this.messageModel(createMessageDto).save();

    // Populate để lấy thông tin chi tiết của chatRoom và sender
    const populatedMessage = await this.messageModel
      .findById(createdMessage._id)
      .populate('chatRoom')
      .populate('sender')
      .exec();

    return populatedMessage;
  }

  async findAllMessages(chatRoomId: string): Promise<Message[]> {
    return this.messageModel
      .find({ chatRoom: chatRoomId })
      .populate('sender')
      .exec();
  }
}
