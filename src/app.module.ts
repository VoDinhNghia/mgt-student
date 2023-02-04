import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './modules/countries/countries.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUrl } from './configs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NewsModule } from './modules/news/news.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { BranchModule } from './modules/branch/branch.module';

@Module({
  imports: [
    CountriesModule,
    MongooseModule.forRoot(mongoUrl),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'src/public'),
    }),
    AuthModule,
    UsersModule,
    NewsModule,
    AttachmentsModule,
    BranchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
