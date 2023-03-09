import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EuserGender } from 'src/constants/constant';
import { getRandomCode } from 'src/utils/generate.code-profile';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
  })
  classId?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faculties',
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'majors',
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'degreelevels',
  })
  degreeLevel?: mongoose.Types.ObjectId; // Formal university, College...

  @Prop({
    maxlength: 15,
    minlength: 6,
    default: getRandomCode(6),
    unique: true,
  }) // create function generate
  code?: string; // student and lecturer code

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  middleName?: string;

  @Prop()
  avatar?: string;

  @Prop()
  mobile?: string;

  @Prop({ enum: EuserGender, default: EuserGender.MALE })
  gender?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  joinDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({
    type: Array,
  }) // class president, secretary
  positionHeld?: string[];

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'awards',
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: {
      country: {
        type: mongoose.Types.ObjectId,
        ref: 'countries',
      },
      province: String,
      state: String,
      permanentAddress: String,
      temporaryAddress: String,
    },
  })
  location?: {
    province: string;
    country: mongoose.Types.ObjectId;
    state: string;
    permanentAddress: string;
    temporaryAddress: string;
  };

  @Prop({
    type: {
      id: String,
      date: Date,
      location: String,
    },
  })
  identityCardNumber?: {
    id?: string;
    date?: Date; // ngay cap
    location?: string; // noi cap
  };

  @Prop()
  object?: string; // doi tuong chinh sach

  @Prop()
  unionDate?: Date;

  @Prop()
  communistPartyDay?: Date; // ngay vao dang

  @Prop()
  ethnic?: string;

  @Prop()
  religion?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
