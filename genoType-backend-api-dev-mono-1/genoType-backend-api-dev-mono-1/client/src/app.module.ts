import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientSharedModule } from './client-shared/client-shared.module';
import { LicenseModule } from './license/license.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [ClientSharedModule, LicenseModule, UserModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
