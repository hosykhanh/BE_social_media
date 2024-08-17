import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto, UpdateLikeDto } from 'src/dto/like.dto';
import { Like } from 'src/models/like.model';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async createLike(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.createLike(createLikeDto);
  }

  @Get(':postId/likes/:userId')
  async getLikeByPostAndUser(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ): Promise<Like | null> {
    return this.likeService.getLikeByPostAndUser(postId, userId);
  }

  @Put(':id')
  async updateLike(
    @Param('id') id: string,
    @Body() updateLikeDto: UpdateLikeDto,
  ): Promise<{ status: string; message: string; data: Like | null }> {
    const data = await this.likeService.updateLike(id, updateLikeDto);
    return {
      status: 'OK',
      message: 'Update successful',
      data,
    };
  }

  @Get(':postId/likes')
  async getLikeByPostId(@Param('postId') postId: string): Promise<Like[]> {
    return this.likeService.getLikeByPostId(postId);
  }

  @Delete('id')
  async deleteLike(@Param('id') id: string): Promise<Like | null> {
    return this.likeService.deleteLike(id);
  }
}
