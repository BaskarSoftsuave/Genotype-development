import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthSharedModule } from '../auth-shared/auth-shared.module';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { PassportModule } from '@nestjs/passport';

const jwtConfig = config.get('JWT');

@Module({
  imports: [
    AuthSharedModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    PassportModule.register({ defaultStrategy: jwtConfig.defaultStrategy }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
