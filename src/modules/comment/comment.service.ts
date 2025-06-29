import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto, UpdateCommentDto } from 'src/dto/comment.dto';
import { Comment } from 'src/models/comment.model';
import { v2 as cloudinary } from 'cloudinary';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private readonly minioService: MinioService,
  ) {}

  private async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<string> {
    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'comment' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });

    return (uploadedImage as any).secure_url;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    file: Express.Multer.File,
  ): Promise<Comment> {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.uploadImageToCloudinary(file);
    }
    const postData = { ...createCommentDto, image: imageUrl };
    const createdComment = new this.commentModel(postData);
    const savedComment = await createdComment.save();
    return this.commentModel
      .findById(savedComment._id)
      .populate(
        'user',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .exec();
  }

  async getAllComment(): Promise<Comment[]> {
    const comments = await this.commentModel
      .find()
      .populate(
        'user',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .populate('posts')
      .exec();

    return comments.map((comment) => {
      const user = comment.user as any;

      if (user && user?.avatarKey) {
        user.avatar = this.minioService.getSignedUrl(user.avatarKey);
      } else if (user) {
        user.avatar = user.avatar || null;
      }

      return comment;
    });
  }

  async getCommentById(id: string): Promise<Comment> {
    return this.commentModel
      .findById(id)
      .populate(
        'user',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .populate('posts')
      .exec();
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({ posts: postId })
      .populate(
        'user',
        '-password -confirmPassword -otpSecret -encryptedPrivateKey -aesEncryptedKey -iv -publicKey',
      )
      .exec();

    return await Promise.all(
      comments.map(async (comment) => {
        const user = comment.user as any;

        if (user && user?.avatarKey) {
          user.avatar = await this.minioService.getSignedUrl(user.avatarKey);
        } else if (user) {
          user.avatar = user.avatar || null;
        }

        return comment;
      }),
    );
  }

  async getReplies(parentCommentId: string): Promise<Comment[]> {
    return await this.commentModel
      .find({ parentComment: parentCommentId })
      .exec();
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    file?: Express.Multer.File,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException(`Update with ID ${id} not found`);
    }

    if (file) {
      const imageUrl = await this.uploadImageToCloudinary(file);
      updateCommentDto.image = imageUrl;
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();
    return updatedComment;
  }

  async deleteComment(id: string): Promise<Comment | null> {
    const deletedComment = await this.commentModel.findByIdAndDelete(id).exec();
    if (deletedComment) {
      this.logger.log(`Deleted comment with ID ${id}`);
    } else {
      this.logger.log(`Comment with ID ${id} not found for deletion`);
    }
    return deletedComment;
  }
}
