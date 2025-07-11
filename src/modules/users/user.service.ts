import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateUserDto,
  UpdateUserDto,
  UserSignalPublicDto,
} from 'src/dto/user.dto';
import { User } from 'src/models/user.model';
// import { v2 as cloudinary } from 'cloudinary';
import { createHash } from 'crypto';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';

import { ChatRoomService } from '../chatRoom/chatRoom.service';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly chatRoomService: ChatRoomService,
    private readonly minioService: MinioService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Tạo salt
    const salt = await bcrypt.genSalt(10);

    // Mã hóa password và confirmPassword
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.confirmPassword = await bcrypt.hash(
      createUserDto.confirmPassword,
      salt,
    );

    // Tạo khóa mã hóa dựa trên name và email
    // const { publicKey, encryptedPrivateKey, aesEncryptedKey, iv } =
    //   await EncryptionService.generateKeyPair(
    //     createUserDto.name,
    //     createUserDto.email,
    //   );

    const createdUser = new this.userModel({
      ...createUserDto,
    });
    await createdUser.save();
    const userResponse = await this.userModel
      .findById(createdUser._id)
      .select('-password -confirmPassword -otpSecret')
      .exec();
    return userResponse;
  }

  async createUsersFromExcel(data: any[]) {
    const className = data[0][1];

    function ExcelDateToJSDate(excelDate) {
      const date = new Date(Math.floor((excelDate - 25569) * 86400 * 1000));
      return date;
    }

    const users: CreateUserDto[] = data.slice(3).map((row) => {
      const maSo = row[0];
      const phone = row[5];
      const identifier = maSo || phone;
      return {
        maSo: maSo,
        name: row[1],
        dateOfBirth: moment(ExcelDateToJSDate(row[2])).toDate(),
        gender: row[3],
        address: row[4],
        phone: phone,
        email: `${identifier}@gmail.com`,
        password: `${identifier}abc`,
        confirmPassword: `${identifier}abc`,
        identityKey: 'identity-key-base64',
        registrationId: 12345,
        preKeys: [
          {
            keyId: 1,
            publicKey: 'pre-key-public-key-base64',
          },
        ],
        signedPreKey: {
          keyId: 1,
          publicKey: 'signed-pre-key-public-key-base64',
          signature: 'signed-pre-key-signature-base64',
        },
      };
    });

    const userIds: Types.ObjectId[] = [];

    for (const user of users) {
      if (!user.name) {
        console.error(
          `Missing required fields for user: ${JSON.stringify(user)}`,
        );
        continue; // Bỏ qua nếu thiếu thông tin
      }

      const existingUser = await this.userModel.findOne({ email: user.email });

      if (existingUser) {
        console.log(
          `User with email ${user.email} already exists, skipping...`,
        );
        userIds.push(existingUser._id as Types.ObjectId);
        continue;
      }

      // Tạo mới người dùng nếu chưa tồn tại
      try {
        const newUser = await this.create(user);
        userIds.push(newUser._id as Types.ObjectId);
        console.log(`Created user: ${user.email}`);
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error);
      }
    }

    // Tạo phòng chat sau khi tạo tất cả người dùng
    let chatRoom;
    if (userIds.length > 2) {
      try {
        chatRoom = await this.chatRoomService.createChatRoom({
          participants: userIds,
          nameRoom: className,
        });
        console.log(`Created chat room for class: ${className}`);
      } catch (error) {
        console.error(
          `Error creating chat room for class ${className}:`,
          error,
        );
      }
    }
    return chatRoom;
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password')
      .select('-confirmPassword')
      .select('-otpSecret')
      .select('-encryptedPrivateKey')
      .select('-aesEncryptedKey')
      .select('-iv')
      .select('-publicKey')
      .exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel
      .findById(id)
      .select('-password')
      .select('-confirmPassword')
      .select('-otpSecret')
      .select('-encryptedPrivateKey')
      .select('-aesEncryptedKey')
      .select('-iv')
      .select('-publicKey')
      .exec();
  }

  async otpFindById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getSignalPublicBundle(userId: string): Promise<UserSignalPublicDto> {
    const user = await this.userModel
      .findById(userId)
      .select('identityKey registrationId preKeys signedPreKey');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      identityKey: user.identityKey,
      registrationId: user.registrationId,
      preKeys: user.preKeys,
      signedPreKey: user.signedPreKey,
    };
  }

  async searchUsers(userId: string, search: string): Promise<User[]> {
    const users = await this.userModel
      .find({
        _id: { $ne: userId },
        name: { $regex: search, $options: 'i' },
      })
      .select('-password')
      .select('-confirmPassword')
      .select('-otpSecret')
      .select('-encryptedPrivateKey')
      .select('-aesEncryptedKey')
      .select('-iv')
      .select('-publicKey')
      .exec();

    return users;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .select('-confirmPassword')
      .select('-otpSecret')
      .select('-encryptedPrivateKey')
      .select('-aesEncryptedKey')
      .select('-iv')
      .select('-publicKey')
      .exec();
    if (updatedUser) {
      this.logger.log(`Updated user with ID ${id}`);
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

  async deleteManyUser(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.userModel
      .deleteMany({ _id: { $in: ids } })
      .exec();

    if (result.deletedCount > 0) {
      this.logger.log(
        `Deleted ${result.deletedCount} users with IDs: ${ids.join(', ')}`,
      );
    } else {
      this.logger.log(
        `No users found for deletion with provided IDs: ${ids.join(', ')}`,
      );
    }

    return { deletedCount: result.deletedCount };
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<User | null> {
    try {
      // Tạo MD5 hash của file buffer
      const fileHash = createHash('md5').update(file.buffer).digest('hex');

      // Tìm kiếm file avatar trên Cloudinary bằng MD5 hash
      // const existingAvatar = await cloudinary.search
      //   .expression(
      //     `resource_type:image AND folder:avatars AND context.hash:${fileHash}`,
      //   )
      //   .execute();

      // let avatarUrl: string;

      // // Nếu avatar đã tồn tại, trả về URL của avatar
      // if (existingAvatar.resources && existingAvatar.resources.length > 0) {
      //   avatarUrl = existingAvatar.resources[0].secure_url;
      // } else {
      //   // Nếu không tìm thấy avatar, tải file lên Cloudinary
      //   const uploadedImage = await new Promise((resolve, reject) => {
      //     cloudinary.uploader
      //       .upload_stream(
      //         { folder: 'avatars', context: { hash: fileHash } },
      //         (error, result) => {
      //           if (error) return reject(error);
      //           resolve(result);
      //         },
      //       )
      //       .end(file.buffer);
      //   });

      //   avatarUrl = (uploadedImage as any).secure_url;
      // }

      const key = `avatars/${fileHash}-${file.originalname}`;

      // Upload ảnh lên MinIO
      await this.minioService.uploadFile(file, key);

      // Cập nhật đường dẫn avatar vào cơ sở dữ liệu
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          id,
          { avatarKey: key },
          { new: true }, // Trả về dữ liệu sau khi đã cập nhật
        )
        .select('-password')
        .select('-confirmPassword')
        .select('-otpSecret')
        .select('-encryptedPrivateKey')
        .select('-aesEncryptedKey')
        .select('-iv')
        .select('-publicKey');

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
      .select('-password')
      .select('-confirmPassword')
      .select('-otpSecret')
      .select('-encryptedPrivateKey')
      .select('-aesEncryptedKey')
      .select('-iv')
      .select('-publicKey')
      .exec();
    return user;
  }

  async removeFriend(userId: string, friendId: string): Promise<User | null> {
    const userObjectId = new Types.ObjectId(userId);
    const friendObjectId = new Types.ObjectId(friendId);

    const [user] = await Promise.all([
      this.userModel
        .findByIdAndUpdate(
          userId,
          { $pull: { friends: friendObjectId } },
          { new: true },
        )
        .select('-password')
        .select('-confirmPassword')
        .select('-otpSecret')
        .select('-encryptedPrivateKey')
        .select('-aesEncryptedKey')
        .select('-iv')
        .select('-publicKey')
        .exec(),
      this.userModel
        .findByIdAndUpdate(
          friendId,
          { $pull: { friends: userObjectId } },
          { new: true },
        )
        .select('-password')
        .select('-confirmPassword')
        .select('-otpSecret')
        .select('-encryptedPrivateKey')
        .select('-aesEncryptedKey')
        .select('-iv')
        .select('-publicKey')
        .exec(),
    ]);

    return user;
  }

  async getFriendSuggestions(
    userId: string,
  ): Promise<{ user: User; mutualFriendsCount: number }[]> {
    const currentUser = await this.userModel.findById(userId).exec();
    if (!currentUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const friendsList = currentUser.friends.map((friend) => friend.toString());

    const userChatRooms =
      await this.chatRoomService.findChatRoomsByUserId(userId);

    // Đếm số phòng chat chung cho mỗi người
    const commonChatCounts: Record<string, number> = {};
    for (const room of userChatRooms) {
      room.participants.forEach((participantId) => {
        const participantIdStr = participantId.toString();
        if (
          participantIdStr !== userId &&
          !friendsList.includes(participantIdStr)
        ) {
          commonChatCounts[participantIdStr] =
            (commonChatCounts[participantIdStr] || 0) + 1;
        }
      });
    }

    // Tập hợp những người có từ 2 phòng chat chung trở lên
    const usersWithTwoOrMoreCommonChats = new Set<string>(
      Object.keys(commonChatCounts).filter((id) => commonChatCounts[id] >= 2),
    );

    // Lọc những người không phải là bạn bè và tính số bạn chung lớn hơn 1
    const allUsers = await this.userModel
      .find({ _id: { $ne: userId } })
      .select(
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .exec();
    const suggestions = await Promise.all(
      allUsers
        .filter(
          (user) =>
            !friendsList.includes(user._id.toString()) &&
            user._id.toString() !== userId,
        )
        .map(async (user) => {
          const mutualFriendsCount = user.friends.filter((friendId) =>
            friendsList.includes(friendId.toString()),
          ).length;

          // Chỉ thêm vào danh sách gợi ý nếu số bạn chung lớn hơn 1
          if (
            mutualFriendsCount > 1 ||
            usersWithTwoOrMoreCommonChats.has(user._id.toString())
          ) {
            return {
              user,
              mutualFriendsCount,
              isInCommonChat: usersWithTwoOrMoreCommonChats.has(
                user._id.toString(),
              ),
            };
          }
          return null;
        }),
    );

    const validSuggestions = suggestions.filter(
      (suggestion) => suggestion !== null,
    );

    // Sắp xếp danh sách gợi ý theo ưu tiên:
    // - Ưu tiên người có từ 2 phòng chat chung với user
    // - Nếu không, sắp xếp theo số bạn chung (mutualFriendsCount) giảm dần
    validSuggestions.sort((a, b) => {
      if (a.isInCommonChat && !b.isInCommonChat) return -1;
      if (!a.isInCommonChat && b.isInCommonChat) return 1;
      return b.mutualFriendsCount - a.mutualFriendsCount;
    });

    return validSuggestions.map(({ user, mutualFriendsCount }) => ({
      user,
      mutualFriendsCount,
    }));
  }

  async addFriendRequest(
    fromUserId: string,
    toUserId: string,
  ): Promise<User | null> {
    const user = await this.userModel.findById(toUserId);
    if (user) {
      const fromUserObjectId = new Types.ObjectId(fromUserId);
      // Kiểm tra xem yêu cầu kết bạn từ fromUserId đã tồn tại hay chưa
      const existingRequest = user.friendRequests.find(
        (request) =>
          request.from.toString() === fromUserId &&
          request.status === 'pending',
      );

      if (existingRequest) {
        return user;
      }
      user.friendRequests.push({ from: fromUserObjectId, status: 'pending' });
      return user.save();
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
        .select('-password')
        .select('-confirmPassword')
        .select('-otpSecret')
        .select('-encryptedPrivateKey')
        .select('-aesEncryptedKey')
        .select('-iv')
        .select('-publicKey')
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
        .select('-password')
        .select('-confirmPassword')
        .select('-otpSecret')
        .select('-encryptedPrivateKey')
        .select('-aesEncryptedKey')
        .select('-iv')
        .select('-publicKey')
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
        .select('-password')
        .select('-confirmPassword')
        .select('-otpSecret')
        .select('-encryptedPrivateKey')
        .select('-aesEncryptedKey')
        .select('-iv')
        .select('-publicKey')
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
      .select('-confirmPassword')
      .select('-otpSecret')
      .select('-encryptedPrivateKey')
      .select('-aesEncryptedKey')
      .select('-iv')
      .select('-publicKey')
      .exec();

    return user;
  }

  async deleteSentFriendRequest(
    fromUserId: string,
    toUserId: string,
  ): Promise<User | null> {
    try {
      const fromUserObjectId = new Types.ObjectId(fromUserId);
      const user = await this.userModel
        .findByIdAndUpdate(
          toUserId, // Tìm người nhận
          {
            $pull: { friendRequests: { from: fromUserObjectId } }, // Xoá yêu cầu từ người gửi
          },
          { new: true },
        )
        .select('-password')
        .select('-confirmPassword')
        .select('-otpSecret')
        .select('-encryptedPrivateKey')
        .select('-aesEncryptedKey')
        .select('-iv')
        .select('-publicKey')
        .exec();

      if (!user) {
        this.logger.error(
          `Failed to delete sent friend request: User not found`,
        );
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to delete sent friend request: ${error.message}`,
      );
      throw new Error('Failed to delete sent friend request');
    }
  }
}
