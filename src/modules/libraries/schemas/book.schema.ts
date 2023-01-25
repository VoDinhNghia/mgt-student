import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categorybooks',
  })
  categoryBook?: mongoose.Types.ObjectId;

  @Prop()
  description?: string;

  @Prop()
  author?: string;

  @Prop()
  publishYear?: string;

  @Prop()
  amount?: number;

  @Prop()
  loanAmount?: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
