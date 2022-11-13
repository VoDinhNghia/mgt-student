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
      attachmentId: mongoose.Types.ObjectId;
      semesterId: mongoose.Types.ObjectId;
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
        semester: mongoose.Types.ObjectId;
        listSubject: [
          // list subject
          {
            subjectId: mongoose.Types.ObjectId;
            result: string; // failed or pass
          },
        ];
      },
    ];
    toeicCertificate: {
      status: {
        type: boolean;
        default: false;
      };
      attachmentId: mongoose.Types.ObjectId;
      scores: number;
    };
    itCertificate: {
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
    type: mongoose.Types.ObjectId,
    ref: 'awards',
  })
  award?: string[];

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

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
