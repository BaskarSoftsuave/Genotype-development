import { Module } from '@nestjs/common';
import { ClientSharedModule } from '../client-shared/client-shared.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LicenseService } from '../license/license.service';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [ClientSharedModule],
  controllers: [UserController],
  providers: [UserService, LicenseService, ProjectService],
})
export class UserModule {}
