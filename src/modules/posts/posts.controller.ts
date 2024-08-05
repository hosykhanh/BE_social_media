import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/dto/posts.dto';
import { Posts } from 'src/models/posts.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'image' là tên của trường file trong form
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Posts> {
    return await this.postsService.createPosts(createPostDto, file);
  }
}
