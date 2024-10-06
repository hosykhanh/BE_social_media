import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from 'src/dto/posts.dto';
import { Posts } from 'src/models/posts.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'image' là tên của trường file trong form
  async createPosts(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Posts | null> {
    return await this.postsService.createPosts(createPostDto, file);
  }

  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPostsById(@Param('id') id: string): Promise<Posts | null> {
    return this.postsService.getPostsById(id);
  }

  @Get(':userId/post')
  async getPostsByUserId(@Param('userId') userId: string): Promise<Posts[]> {
    return this.postsService.getPostsByUserId(userId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updatePosts(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ status: string; message: string; data: Posts | null }> {
    const data = await this.postsService.updatePosts(id, updatePostDto, file);
    return {
      status: 'OK',
      message: 'Update successful',
      data,
    };
  }

  @Delete(':id')
  async deletePosts(@Param('id') id: string): Promise<Posts | null> {
    return this.postsService.deletePosts(id);
  }

  @Delete('delete-many')
  async deleteManyPosts(
    @Body('ids') ids: string[],
  ): Promise<{ status: string; message: string; deletedCount: number }> {
    const result = await this.postsService.deleteManyPost(ids);
    const deletedCount = result.deletedCount;
    return {
      status: 'OK',
      message: 'Delete successful',
      deletedCount,
    };
  }
}
