import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://hosykhanh1108:khanh1234@clustersocialmedia.2vmerps.mongodb.net/',
    ),
  ],
})
export class DatabaseModule {}
