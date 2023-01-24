import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomInfoDocument = RoomInfo & Document;

@Schema()
export class RoomInfo {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop()
  type?: string;

  @Prop()
  capacity?: number;

  @Prop()
  divice?: {
    projector?: string;
    airConditioner?: string;
  };

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const RoomsSchema = SchemaFactory.createForClass(RoomInfo);
