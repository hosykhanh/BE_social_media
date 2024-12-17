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
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from 'src/dto/posts.dto';
import { Posts } from 'src/models/posts.model';
import { JwtAuthService } from '../login/jwt.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'image' là tên của trường file trong form
  async createPosts(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
  ): Promise<Posts | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return await this.postsService.createPosts(createPostDto, file);
  }

  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPostsById(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Posts | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.postsService.getPostsById(id);
  }

  @Get(':userId/post')
  async getPostsByUserId(
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Posts[]> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.postsService.getPostsByUserId(userId);
  }

  @Get('weight/posts/:userId')
  async getPostsSortedByWeight(
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ) {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.postsService.getPostsSortedByWeight(userId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updatePosts(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; data: Posts | null }> {
    const post = await this.postsService.getPostsById(id);
    const userId = post.user._id.toString();
    await this.jwtAuthService.checkRole(authHeader, 'user', userId);
    const data = await this.postsService.updatePosts(id, updatePostDto, file);
    return {
      status: 'OK',
      message: 'Update successful',
      data,
    };
  }

  @Delete(':id')
  async deletePosts(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; data: Posts | null }> {
    const post = await this.postsService.getPostsById(id);
    const userId = post.user._id.toString();
    await this.jwtAuthService.checkRole(authHeader, 'user', userId);
    const data = await this.postsService.deletePosts(id);
    return {
      status: 'OK',
      message: 'Delete successful',
      data,
    };
  }

  @Delete('delete-many')
  async deleteManyPosts(
    @Body('ids') ids: string[],
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; deletedCount: number }> {
    await this.jwtAuthService.checkRole(authHeader, 'admin');
    const result = await this.postsService.deleteManyPost(ids);
    const deletedCount = result.deletedCount;
    return {
      status: 'OK',
      message: 'Delete successful',
      deletedCount,
    };
  }
}
