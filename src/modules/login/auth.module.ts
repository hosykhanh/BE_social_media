import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthService } from './jwt.service';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../schema/user.schema';
import { ChatRoomModule } from '../chatRoom/chatRoom.module';

@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is imported
    forwardRef(() => ChatRoomModule),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here as well
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [JwtAuthService, UserService],
  controllers: [AuthController],
  exports: [JwtAuthService],
})
export class AuthModule {}
