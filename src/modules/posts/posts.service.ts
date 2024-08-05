import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from 'src/dto/posts.dto';
import { Posts } from 'src/models/posts.model';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Posts') private readonly postsModel: Model<Posts>,
  ) {}

  async createPosts(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Posts> {
    let imageUrl: string | undefined;

    if (file) {
      const uploadedImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'posts' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });

      imageUrl = (uploadedImage as any).secure_url;
    }

    // Tạo bài đăng mới với đường dẫn ảnh nếu có
    const newPostData = {
      ...createPostDto,
      image: imageUrl, // Lưu đường dẫn ảnh vào trường image
    };

    const createdPost = new this.postsModel(newPostData);
    return createdPost.save();
  }
}
