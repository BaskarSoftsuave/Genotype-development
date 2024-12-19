import { Module } from '@nestjs/common';
import { ClientSharedModule } from '../client-shared/client-shared.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { UserService } from '../user/user.service';
import { LicenseService } from '../license/license.service';

@Module({
  imports: [ClientSharedModule],
  controllers: [ProjectController],
  providers: [ProjectService, UserService, LicenseService],
})
export class ProjectModule {}
