import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUrl } from './configs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CountriesModule,
    MongooseModule.forRoot(mongoUrl),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
