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
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from 'src/dto/comment.dto';
import { Comment } from 'src/models/comment.model';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Comment | null> {
    return await this.commentService.createComment(createCommentDto, file);
  }

  @Get()
  async getAllComment() {
    return this.commentService.getAllComment();
  }

  @Get(':id')
  async getCommentById(@Param('id') id: string): Promise<Comment | null> {
    return this.commentService.getCommentById(id);
  }

  @Get(':postId/comments')
  async getCommentsByPost(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentService.getCommentsByPostId(postId);
  }

  @Get('replies/:parentCommentId')
  async getReplies(
    @Param('parentCommentId') parentCommentId: string,
  ): Promise<Comment[]> {
    return this.commentService.getReplies(parentCommentId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ status: string; message: string; data: Comment | null }> {
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
  async deleteComment(@Param('id') id: string): Promise<Comment | null> {
    return this.commentService.deleteComment(id);
  }
}
