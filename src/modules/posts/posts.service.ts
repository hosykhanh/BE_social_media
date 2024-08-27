import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, UpdatePostDto } from 'src/dto/posts.dto';
import { Posts } from 'src/models/posts.model';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(
    @InjectModel('Posts') private readonly postsModel: Model<Posts>,
  ) {}

  private async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<string> {
    const resourceType = file.mimetype.startsWith('video') ? 'video' : 'image';

    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: resourceType, folder: 'posts' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });

    return (uploadedImage as any).secure_url;
  }

  async createPosts(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Posts> {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.uploadImageToCloudinary(file);
    }
    const postData = { ...createPostDto, image: imageUrl };
    const createdPost = new this.postsModel(postData);
    return createdPost.save();
  }

  async getAllPosts(): Promise<Posts[]> {
    return this.postsModel.find().populate('user', '-password').exec();
  }

  async getPostsById(id: string): Promise<Posts> {
    return this.postsModel.findById(id).populate('user', '-password').exec();
  }

  async getPostsByUserId(userId: string): Promise<Posts[]> {
    return this.postsModel
      .find({ user: userId })
      .populate('user', '-password')
      .exec();
  }

  async updatePosts(
    id: string,
    updatePostDto: UpdatePostDto,
    file?: Express.Multer.File,
  ): Promise<Posts> {
    const post = await this.postsModel.findById(id);
    if (!post) {
      throw new NotFoundException(`Update with ID ${id} not found`);
    }

    if (file) {
      const imageUrl = await this.uploadImageToCloudinary(file);
      updatePostDto.image = imageUrl;
    }

    const updatedPost = await this.postsModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    return updatedPost;
  }

  async deletePosts(id: string): Promise<Posts | null> {
    const deletedPosts = await this.postsModel.findByIdAndDelete(id).exec();
    if (deletedPosts) {
      this.logger.log(`Deleted posts with ID ${id}`);
    } else {
      this.logger.log(`Posts with ID ${id} not found for deletion`);
    }
    return deletedPosts;
  }
}
