import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async updateAvatar(id: string, file: Express.Multer.File): Promise<string> {
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

      return avatarUrl;
    } catch (error) {
      this.logger.error(
        `Failed to update avatar for user with ID ${id}`,
        error.stack,
      );
      throw error;
    }
  }
}
