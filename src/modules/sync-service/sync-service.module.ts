import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../users/schemas/users.schema';
import { SyncServiceController } from './sync-service.controller';
import { SyncServiceService } from './sync-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [SyncServiceController],
  providers: [SyncServiceService],
})
export class SyncServiceModule {}
