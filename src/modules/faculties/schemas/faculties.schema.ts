import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FacultyDocument = Faculty & Document;

@Schema()
export class Faculty {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branchs',
  })
  branch?: mongoose.Types.ObjectId;

  @Prop()
  introduction?: string;

  @Prop()
  foundYear?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'awards',
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: {
      lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      headOfSection: Boolean,
      eputyHead: Boolean,
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

export const FacultySchema = SchemaFactory.createForClass(Faculty);
