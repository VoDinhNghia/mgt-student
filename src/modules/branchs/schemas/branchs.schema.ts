import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type BranchDocument = Branch & Document;

@Schema()
export class Branch extends FieldsCommonSchema {
  @Prop({ required: true })
  title?: string;

  @Prop({ required: true })
  name?: string; // Quang Ngai, HCM, Thanh Hoa

  @Prop()
  description?: string;

  @Prop()
  website?: string;

  @Prop({
    type: {
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionNames.countries,
      },
      province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionNames.provinces,
      },
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionNames.districts,
      },
      ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionNames.wards,
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

  @Prop()
  contactInfo?: [
    {
      email?: string;
      fax?: string;
      mobile?: string;
    },
  ];
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
