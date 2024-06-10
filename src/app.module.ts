import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/login/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Set ConfigModule as global
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
