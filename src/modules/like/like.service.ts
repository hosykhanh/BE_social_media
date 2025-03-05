import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from 'src/models/like.model';
import { CreateLikeDto, UpdateLikeDto } from 'src/dto/like.dto';

@Injectable()
export class LikeService {
  constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}

  async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const existingLike = await this.likeModel.findOne({
      user: createLikeDto.user,
      posts: createLikeDto.posts,
    });
    if (existingLike) {
      return existingLike;
    }
    const createdLike = new this.likeModel(createLikeDto);
    return createdLike.save();
  }

  async getLikeByPostAndUser(
    postId: string,
    userId: string,
  ): Promise<Like | null> {
    return this.likeModel.findOne({ posts: postId, user: userId }).exec();
  }

  async getLikeByPostId(postId: string): Promise<Like[]> {
    return this.likeModel
      .find({ posts: postId })
      .populate(
        'user',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .exec();
  }

  async updateLike(
    id: string,
    updateLikeDto: UpdateLikeDto,
  ): Promise<Like | null> {
    const updateLike = await this.likeModel
      .findByIdAndUpdate(id, updateLikeDto)
      .exec();
    return updateLike;
  }

  async deleteLike(id: string): Promise<Like | null> {
    const deleteLike = await this.likeModel.findByIdAndDelete(id).exec();
    return deleteLike;
  }
}
