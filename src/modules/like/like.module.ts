import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeSchema } from 'src/schema/like.schema';
import { UserSchema } from 'src/schema/user.schema';
import { PostsSchema } from 'src/schema/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }]),
    MongooseModule.forFeature([{ name: 'Posts', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
