import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { Users, UsersSchema } from '../users/schemas/users.schema';
import { Union, UnionSchema } from './schemas/unions.schema';
import { UnionsController } from './unions.controller';
import { UnionsService } from './unions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Union.name,
        schema: UnionSchema,
      },
      {
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: Attachment.name,
        schema: AttachmentlSchema,
      },
    ]),
  ],
  providers: [UnionsService, ValidateField],
  controllers: [UnionsController],
})
export class UnionsModule {}
