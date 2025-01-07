import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './modules/login/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { LikeModule } from './modules/like/like.module';
import { ChatRoomModule } from './modules/chatRoom/chatRoom.module';
import { MessageModule } from './modules/messages/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Set ConfigModule as global
    }),
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: configService.get<string>('CLOUDINARY_API_KEY'),
        api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    PostsModule,
    CommentModule,
    LikeModule,
    ChatRoomModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
