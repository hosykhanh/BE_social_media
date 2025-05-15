import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from 'src/schema/user.schema';
import { ChatRoomModule } from '../chatRoom/chatRoom.module';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ChatRoomModule,
    AuthModule,
    MinioModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
