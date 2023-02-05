import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BranchDocument = Branch & Document;

@Schema()
export class Branch {
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

  @Prop()
  contactInfo?: [
    {
      email?: string;
      fax?: string;
      mobile?: string;
    },
  ];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
