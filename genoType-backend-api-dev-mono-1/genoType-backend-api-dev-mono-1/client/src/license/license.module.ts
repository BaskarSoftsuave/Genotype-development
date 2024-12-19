import { Module } from '@nestjs/common';
import { ClientSharedModule } from '../client-shared/client-shared.module';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [ClientSharedModule],
  controllers: [LicenseController],
  providers: [LicenseService, UserService, ProjectService],
})
export class LicenseModule {}
