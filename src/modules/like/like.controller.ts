import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Headers,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto, UpdateLikeDto } from 'src/dto/like.dto';
import { Like } from 'src/models/like.model';
import { JwtAuthService } from '../auth/jwt.service';

@Controller('like')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post()
  async createLike(
    @Body() createLikeDto: CreateLikeDto,
    @Headers('authorization') authHeader: string,
  ) {
    await this.jwtAuthService.checkRole(authHeader, 'user');
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
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; data: Like | null }> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
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

  @Delete(':id')
  async deleteLike(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<Like | null> {
    await this.jwtAuthService.checkRole(authHeader, 'user');
    return this.likeService.deleteLike(id);
  }
}
