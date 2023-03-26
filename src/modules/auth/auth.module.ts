import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './guards/auth.local-strategy.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './guards/auth.constants.guard';
import { JwtStrategy } from './guards/auth.jwt-strategy.guard';
import { AuthController } from './auth.controller';
import { expiresInJwt } from 'src/constants/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../users/schemas/users.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    PassportModule,
    JwtModule.register({
      // secret: jwtConstants.secret,
      privateKey: jwtConstants.JWT_PRIVATE_KEY,
      publicKey: jwtConstants.JWT_PUBLIC_KEY,
      signOptions: {
        expiresIn: expiresInJwt,
        algorithm: 'HS512', // default: HS256, only use HS algorithm
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
