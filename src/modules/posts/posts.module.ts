import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsSchema } from 'src/schema/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Posts', schema: PostsSchema }]),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
