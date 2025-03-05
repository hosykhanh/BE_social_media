import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomService } from './chatRoom.service';
import { ChatRoomController } from './chatRoom.controller';
import { ChatRoomSchema } from 'src/schema/chatRoom.schema';
import { UserSchema } from 'src/schema/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatRoom', schema: ChatRoomSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
  ],
  providers: [ChatRoomService],
  controllers: [ChatRoomController],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
