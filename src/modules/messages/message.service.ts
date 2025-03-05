import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from 'src/dto/message.dto';
import { Message } from 'src/models/message.model';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    // Tạo và lưu tin nhắn mới vào cơ sở dữ liệu
    const createdMessage = await new this.messageModel(createMessageDto).save();

    // Populate để lấy thông tin chi tiết của chatRoom và sender
    const populatedMessage = await this.messageModel
      .findById(createdMessage._id)
      .populate('chatRoom')
      .populate(
        'sender',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .exec();

    return populatedMessage;
  }

  async findAllMessages(chatRoomId: string): Promise<Message[]> {
    return this.messageModel
      .find({ chatRoom: chatRoomId })
      .populate(
        'sender',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .exec();
  }

  async getMessageById(id: string): Promise<Message> {
    return this.messageModel
      .findById(id)
      .populate('chatRoom')
      .populate(
        'sender',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .exec();
  }

  async deleteMessage(id: string): Promise<Message | null> {
    const deletedMessage = await this.messageModel.findByIdAndDelete(id).exec();
    if (deletedMessage) {
      this.logger.log(`Deleted posts with ID ${id}`);
    } else {
      this.logger.log(`Posts with ID ${id} not found for deletion`);
    }
    return deletedMessage;
  }

  async deleteMessagesByChatRoom(
    chatRoomId: string,
  ): Promise<{ deletedCount: number }> {
    const result = await this.messageModel
      .deleteMany({ chatRoom: chatRoomId })
      .exec();

    if (result.deletedCount > 0) {
      this.logger.log(
        `Deleted ${result.deletedCount} messages from chat room with ID ${chatRoomId}`,
      );
    } else {
      this.logger.log(`No messages found for chat room with ID ${chatRoomId}`);
    }

    return { deletedCount: result.deletedCount };
  }
}
