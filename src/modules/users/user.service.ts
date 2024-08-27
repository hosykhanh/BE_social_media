import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from 'src/dto/user.dto';
import { User } from 'src/models/user.model';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (updatedUser) {
      this.logger.log(`Updated user with ID ${id}: ${updatedUser}`);
    } else {
      this.logger.log(`User with ID ${id} not found for update`);
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<User | null> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (deletedUser) {
      this.logger.log(`Deleted user with ID ${id}`);
    } else {
      this.logger.log(`User with ID ${id} not found for deletion`);
    }
    return deletedUser;
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<User | null> {
    try {
      const uploadedImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'avatars' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });

      const avatarUrl = (uploadedImage as any).secure_url;

      // Cập nhật đường dẫn avatar vào cơ sở dữ liệu
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { avatar: avatarUrl },
        { new: true }, // Trả về dữ liệu sau khi đã cập nhật
      );

      if (updatedUser) {
        this.logger.log(`Updated avatar for user with ID ${id}`);
      } else {
        this.logger.log(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Failed to update avatar for user with ID ${id}`,
        error.stack,
      );
      throw error;
    }
  }

  async addFriend(userId: string, friendId: string): Promise<User | null> {
    const friendObjectId = new Types.ObjectId(friendId);
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: { friends: friendObjectId },
        },
        { new: true },
      )
      .exec();
    return user;
  }

  async addFriendRequest(
    fromUserId: string,
    toUserId: string,
  ): Promise<User | null> {
    const user = await this.userModel.findById(toUserId);
    if (user) {
      const fromUserObjectId = new Types.ObjectId(fromUserId); // Chuyển đổi fromUserId thành ObjectId
      user.friendRequests.push({ from: fromUserObjectId, status: 'pending' }); // Thêm yêu cầu kết bạn
      return user.save(); // Lưu lại thay đổi
    }
    return null;
  }

  async acceptFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<User | null> {
    try {
      const friendObjectId = new Types.ObjectId(friendId);
      const user = await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $pull: { friendRequests: { from: friendObjectId } }, // Remove the request from the friendRequests array
            $push: { friends: friendObjectId }, // Add to the friends array
          },
          { new: true },
        )
        .exec();

      if (!user) {
        this.logger.error(`Failed to accept friend request: User not found`);
        throw new Error('User not found');
      }

      // Add the user to the friend's friends array
      await this.userModel
        .findByIdAndUpdate(friendId, {
          $push: { friends: new Types.ObjectId(userId) },
        })
        .exec();

      return user;
    } catch (error) {
      this.logger.error(`Failed to accept friend request: ${error.message}`);
      throw new Error('Failed to accept friend request');
    }
  }

  async rejectFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<User | null> {
    try {
      const friendObjectId = new Types.ObjectId(friendId);
      const user = await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $pull: { friendRequests: { from: friendObjectId } }, // Remove the request from the friendRequests array
          },
          { new: true },
        )
        .exec();

      if (!user) {
        this.logger.error(`Failed to reject friend request: User not found`);
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Failed to reject friend request: ${error.message}`);
      throw new Error('Failed to reject friend request');
    }
  }

  async getSentFriendRequests(userId: string): Promise<User[]> {
    const user = await this.userModel
      .find({ 'friendRequests.from': userId })
      .select('-password')
      .exec();

    return user;
  }
}
