import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database-config/database.module';
import { CommonService } from '../services/common/common.service';
import { AuthProviders } from '../auth.providers';
@Module({
  imports: [DatabaseModule],
  providers: [CommonService, ...AuthProviders],
  exports: [CommonService, DatabaseModule, ...AuthProviders],
})
export class AuthSharedModule {}
