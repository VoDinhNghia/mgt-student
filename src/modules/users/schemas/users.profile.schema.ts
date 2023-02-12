import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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
  class?: mongoose.Types.ObjectId;

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

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  middleName?: string;

  @Prop()
  avatar?: string;

  @Prop()
  mobile?: number;

  @Prop()
  gender?: string;

  @Prop({
    type: [
      {
        attachment: {
          type: mongoose.Types.ObjectId,
          ref: 'attachments',
        },
        semester: {
          type: mongoose.Types.ObjectId,
          ref: 'semesters',
        },
      },
    ],
  }) // research articles, graduate theses
  study?: [
    {
      id: string;
      attachment: mongoose.Types.ObjectId;
      semester: mongoose.Types.ObjectId;
      type: string;
    },
  ];

  @Prop({
    type: [
      {
        semester: {
          type: mongoose.Types.ObjectId,
          ref: 'semesters',
        },
        subject: {
          type: mongoose.Types.ObjectId,
          ref: 'subjects',
        },
        attachment: {
          type: mongoose.Types.ObjectId,
          ref: 'attachments',
        },
      },
    ],
  })
  studyProcess?: {
    listSemester: [
      {
        id: string;
        semester: mongoose.Types.ObjectId;
        listSubject: [
          // list subject
          {
            subject: mongoose.Types.ObjectId;
            result: string; // failed or pass
          },
        ];
      },
    ];
    toeicCertificate: {
      id: string;
      status: {
        type: boolean;
        default: false;
      };
      attachment: mongoose.Types.ObjectId;
      scores: number;
    };
    itCertificate: {
      id: string;
      status: {
        type: boolean;
        default: false;
      };
      attachment: mongoose.Types.ObjectId;
      scores: number;
    };
    status: {
      // Are you still studying or graduating or saving?
      type: string;
      default: 'STUDYING';
    };
  };

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  joinDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop() // class president, secretary
  positionHeld?: string[];

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'awards',
  })
  award?: [mongoose.Types.ObjectId];

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
    province: string;
    country: mongoose.Types.ObjectId;
    state: string;
    permanentAddress: string;
    temporaryAddress: string;
  };

  @Prop({ type: Object })
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
