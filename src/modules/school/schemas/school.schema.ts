import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SchoolInfoDocument = SchoolInfo & Document;

@Schema()
export class SchoolInfo {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop()
  schoolCode?: string;

  @Prop()
  numberTotal?: number;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'branchs',
  })
  branchList?: [mongoose.Types.ObjectId];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attachments',
  })
  image?: [mongoose.Types.ObjectId];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'awards',
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'countries',
    },
  })
  location?: {
    province?: string;
    country?: mongoose.Types.ObjectId;
    city?: string;
    state?: string;
    address?: string;
  };

  @Prop()
  contactInfo?: {
    email?: string;
    fax?: string;
    mobile?: string;
  };

  @Prop({
    attachment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'attachments',
    },
  })
  policy?: [
    {
      name?: string;
      effectiveDate?: Date;
      content?: string;
      attachment?: mongoose.Types.ObjectId;
    },
  ];

  @Prop()
  yearFound?: Date;

  @Prop()
  generalInfo?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const SchoolSchema = SchemaFactory.createForClass(SchoolInfo);
