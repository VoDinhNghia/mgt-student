import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EroomType } from 'src/constants/constant';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type RoomsDocument = Rooms & Document;

@Schema({ collection: collections.rooms, versionKey: false })
export class Rooms extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop({ default: EroomType.CLASS_ROOM })
  type?: EroomType;

  @Prop()
  capacity?: number;

  @Prop({
    type: {
      projector: String,
      airConditioner: String,
      status: String,
    },
  })
  divice?: {
    projector?: string;
    airConditioner?: string;
    status?: string;
  };

  @Prop()
  description?: string;

  @Prop({ default: false })
  status?: boolean; // false is empty, use for group study room
}

export const RoomSchema = SchemaFactory.createForClass(Rooms);
