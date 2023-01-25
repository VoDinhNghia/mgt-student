import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema()
export class Appointment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  })
  student?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'servicelibrarys',
  })
  service?: mongoose.Types.ObjectId;

  @Prop()
  receivedDate?: {
    date?: Date;
    status?: string; // expired, accepted, cancel,
  };

  @Prop()
  returnSchedule?: {
    date?: Date;
    status?: string;
    extensionDate?: Date;
    extensionCost?: number;
  };

  @Prop()
  amount?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'books',
  })
  book?: mongoose.Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'rooms',
  })
  room?: [mongoose.Types.ObjectId];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'news',
  })
  magazine?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
