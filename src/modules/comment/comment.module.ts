import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentSchema } from 'src/schema/comment.schema';
import { UserSchema } from 'src/schema/user.schema';
import { PostsSchema } from 'src/schema/posts.schema';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Posts', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    MinioModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
