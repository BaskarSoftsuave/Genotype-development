import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
// import { ConfigService } from './service/config/config.service';
// import { HealthCheckService } from './service/health-check/health-check.service';
import { ClientController } from './controllers/client/client.controller';
import { LoggerMiddleware } from './logger.middleware';
import { AuthController } from './controllers/auth/auth.controller';
// import { AuthService } from './service/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/jwt/jwt.strategy';
// import { ClientService } from './service/client/client.service';
import { DatabaseModule } from './database-config/database.module';
import { UserService } from './service/user/user.service';
import { CommonService } from './service/common/common.service';
import { LicenseService } from './service/licence/license.service';
import { ProjectService } from './service/project/project.service';

const jwtConfig = config.get('JWT');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: jwtConfig.defaultStrategy }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),    
    DatabaseModule
  ],
  controllers: [AppController, ClientController, AuthController],
  providers: [
    AppService,
    // HealthCheckService,
    // {
    //   provide: 'REDIS_SERVICE',
    //   useFactory: (configService: ConfigService) => {
    //     return ClientProxyFactory.create(configService.get('redisService'));
    //   },
    //   inject: [ConfigService],
    // },
    // ConfigService,
    // AuthService,
    // ClientService,
    JwtStrategy,
    CommonService,
    UserService,
    LicenseService,
    ProjectService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
