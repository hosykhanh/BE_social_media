import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './modules/login/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'nestjs-cloudinary';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
