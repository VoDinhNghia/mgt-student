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
    type: [
      {
        country: {
          type: mongoose.Types.ObjectId,
          ref: 'countries',
        },
      },
    ],
  })
  location?: {
    province?: string;
    country?: mongoose.Types.ObjectId;
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
