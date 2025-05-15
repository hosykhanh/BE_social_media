import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsSchema } from 'src/schema/posts.schema';
import { UserSchema } from 'src/schema/user.schema';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Posts', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    LikeModule,
    CommentModule,
    UserModule,
    AuthModule,
    MinioModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
