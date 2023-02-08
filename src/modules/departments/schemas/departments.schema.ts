import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DepartmentsDocument = Departments & Document;

@Schema()
export class Departments {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faculties',
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop()
  name?: string;

  @Prop()
  introduction?: string;

  @Prop()
  foundYear?: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'awards',
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  })
  lecturerList?: [
    {
      lecturer?: mongoose.Types.ObjectId;
      headOfSection?: boolean;
      eputyHead?: boolean;
    },
  ];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const DepartmentsMajorSchema = SchemaFactory.createForClass(Departments);
