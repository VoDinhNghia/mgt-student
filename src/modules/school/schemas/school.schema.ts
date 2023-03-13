/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { schoolId } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type SchoolInfoDocument = School_Info & Document;

@Schema()
export class School_Info extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop({ required: true, default: schoolId })
  schoolId?: string;

  @Prop()
  schoolCode?: string;

  @Prop()
  numberTotal?: number;

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
    type: {
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'countries',
      },
      province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provinces',
      },
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'districts',
      },
      ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wards',
      },
      address: String,
    },
  })
  location?: {
    province?: mongoose.Types.ObjectId;
    country?: mongoose.Types.ObjectId;
    district?: mongoose.Types.ObjectId;
    ward?: mongoose.Types.ObjectId;
    address?: string;
  };

  @Prop({
    type: {
      email: String,
      fax: String,
      mobile: String,
    },
  })
  contactInfo?: {
    email?: string;
    fax?: string;
    mobile?: string;
  };

  @Prop({
    type: [
      {
        attachment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'attachments',
        },
        name: String,
        effectiveDate: Date,
        content: String,
      },
    ],
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
}

export const SchoolSchema = SchemaFactory.createForClass(School_Info);
