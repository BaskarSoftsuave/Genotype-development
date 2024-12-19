import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthSharedModule } from './auth-shared/auth-shared.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [AuthSharedModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
