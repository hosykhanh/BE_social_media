import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageSchema } from '../../schema/message.schema';
import { ChatGateway } from '../chatSocket/chat.gateway';
import { ChatRoomModule } from '../chatRoom/chatRoom.module';
import { AuthModule } from '../login/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    ChatRoomModule,
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, ChatGateway], // Provide ChatGateway here
})
export class MessageModule {}
