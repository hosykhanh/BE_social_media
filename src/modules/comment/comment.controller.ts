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
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from 'src/dto/comment.dto';
import { Comment } from 'src/models/comment.model';
import { JwtAuthService } from '../auth/jwt.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
  ): Promise<Comment | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return await this.commentService.createComment(createCommentDto, file);
  }

  @Get()
  async getAllComment() {
    return this.commentService.getAllComment();
  }

  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Comment | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.commentService.getCommentById(id);
  }

  @Get(':postId/comments')
  async getCommentsByPost(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentService.getCommentsByPostId(postId);
  }

  @Get('replies/:parentCommentId')
  async getReplies(
    @Param('parentCommentId') parentCommentId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Comment[]> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.commentService.getReplies(parentCommentId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; data: Comment | null }> {
    const comment = await this.commentService.getCommentById(id);
    const userId = comment.user._id.toString();
    await this.jwtAuthService.checkRole(authHeader, 'user', userId);
    const data = await this.commentService.updateComment(
      id,
      updateCommentDto,
      file,
    );
    return {
      status: 'OK',
      message: 'Update successful',
      data,
    };
  }

  @Delete(':id')
  async deleteComment(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Comment | null> {
    const comment = await this.commentService.getCommentById(id);
    const userId = comment.user._id.toString();
    await this.jwtAuthService.checkRole(authHeader, 'user', userId);
    return this.commentService.deleteComment(id);
  }
}
