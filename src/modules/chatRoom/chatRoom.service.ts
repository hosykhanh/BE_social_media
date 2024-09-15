import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoomDto } from 'src/dto/chatRoom.dto';
import { ChatRoom } from 'src/models/chatRoom.model';

@Injectable()
export class ChatRoomService {
  private readonly logger = new Logger(ChatRoomService.name);

  constructor(
    @InjectModel('ChatRoom') private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async createChatRoom(chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
    const createdChatRoom = new this.chatRoomModel(chatRoomDto);
    return createdChatRoom.save();
  }

  async createPrivateChatRoom(
    userId: string,
    otherUserId: string,
  ): Promise<ChatRoom> {
    // Kiểm tra xem phòng chat giữa 2 người đã tồn tại hay chưa
    const existingChatRoom = await this.chatRoomModel
      .findOne({
        participants: { $all: [userId, otherUserId] },
      })
      .exec();

    if (existingChatRoom) {
      return existingChatRoom; // Nếu đã có phòng chat, trả về phòng chat đó
    }

    // Nếu chưa có phòng chat, tạo mới
    const newChatRoom = new this.chatRoomModel({
      participants: [userId, otherUserId],
    });

    return await newChatRoom.save();
  }

  async findAll(): Promise<ChatRoom[]> {
    return this.chatRoomModel.find().exec();
  }

  async findById(id: string): Promise<ChatRoom> {
    return this.chatRoomModel.findById(id).exec();
  }

  async findChatRoomsByUserId(userId: string): Promise<ChatRoom[]> {
    return await this.chatRoomModel
      .find({ participants: userId })
      .populate('participants')
      .exec();
  }

  async addParticipant(chatRoomId: string, userId: string): Promise<ChatRoom> {
    return this.chatRoomModel
      .findByIdAndUpdate(
        chatRoomId,
        { $push: { participants: new Types.ObjectId(userId) } },
        { new: true },
      )
      .exec();
  }

  async addUsersToChatRoom(
    chatRoomId: string,
    userIds: string[],
  ): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomModel.findById(chatRoomId);
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    const userObjectIds = userIds.map((id) => new Types.ObjectId(id));

    chatRoom.participants.push(...userObjectIds);
    return await chatRoom.save();
  }

  async updateChatRoom(
    chatRoomId: string,
    chatRoomDto: ChatRoomDto,
  ): Promise<ChatRoom> {
    return this.chatRoomModel
      .findByIdAndUpdate(chatRoomId, chatRoomDto, { new: true })
      .exec();
  }

  async deleteChatRoom(chatRoomId: string): Promise<ChatRoom> {
    return this.chatRoomModel.findByIdAndDelete(chatRoomId).exec();
  }
}