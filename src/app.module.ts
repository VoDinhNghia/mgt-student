import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './modules/countries/countries.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NewsModule } from './modules/news/news.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { BranchModule } from './modules/branchs/branchs.module';
import { ClassSubjectModule } from './modules/class-subject/class-subject.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { AwardsModule } from './modules/awards/awards.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UnionsModule } from './modules/unions/unions.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import { SchoolModule } from './modules/school/school.module';
import { ScholarshipModule } from './modules/scholarships/scholarships.module';
import { DegreelevelModule } from './modules/degreelevels/degreelevels.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InstituteModule } from './modules/institute/institute.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { CenterModule } from './modules/centers/centers.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { DbConnection } from './constants/constants.db.mongo.connection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SyncServiceModule } from './modules/sync-service/sync-service.module';
import { ChatModule } from './modules/chat/chat.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60, // the number of seconds that each request will last in storage
      limit: 20, // the maximum number of requests within the TTL limit
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'src/public'),
    }),
    AuthModule,
    UsersModule,
    PermissionsModule,
    AttachmentsModule,
    BranchModule,
    ClassSubjectModule,
    FacultiesModule,
    AwardsModule,
    CoursesModule,
    RoomsModule,
    UnionsModule,
    SemestersModule,
    SchoolModule,
    ScholarshipModule,
    DegreelevelModule,
    PaymentsModule,
    InstituteModule,
    DepartmentsModule,
    CenterModule,
    CountriesModule,
    NewsModule,
    BlogsModule,
    SyncServiceModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, DbConnection],
})
export class AppModule {}
