import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { schoolId } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SchoolInfoDocument = SchoolInfo & Document;

@Schema({ collection: collections.school_infos, versionKey: false })
export class SchoolInfo extends FieldsCommonSchema {
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
    ref: collections.attachments,
  })
  image?: [mongoose.Types.ObjectId];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: collections.awards,
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: {
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.countries,
      },
      province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.provinces,
      },
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.districts,
      },
      ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.wards,
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
          ref: collections.attachments,
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

export const SchoolSchema = SchemaFactory.createForClass(SchoolInfo);
