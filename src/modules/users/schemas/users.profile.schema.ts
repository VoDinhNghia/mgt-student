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
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
  })
  classId?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faculties',
  })
  facultyId?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  })
  courseId?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'degreelevels',
  })
  degreeLevelId?: mongoose.Types.ObjectId; // Formal university, College...

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
        attachmentId: {
          type: mongoose.Types.ObjectId,
          ref: 'attachments',
        },
        semesterId: {
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
        semesterId: {
          type: mongoose.Types.ObjectId,
          ref: 'semesters',
        },
        subjectId: {
          type: mongoose.Types.ObjectId,
          ref: 'subjects',
        },
        attachmentId: {
          type: mongoose.Types.ObjectId,
          ref: 'attachments',
        },
      },
    ],
  })
  studyProcess?: {
    listSemester: [
      {
        semesterId: mongoose.Types.ObjectId;
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
      attachmentId: mongoose.Types.ObjectId;
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
        countryId: {
          type: mongoose.Types.ObjectId,
          ref: 'countries',
        },
      },
    ],
  })
  location?: {
    province: string;
    countryId: mongoose.Types.ObjectId;
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
