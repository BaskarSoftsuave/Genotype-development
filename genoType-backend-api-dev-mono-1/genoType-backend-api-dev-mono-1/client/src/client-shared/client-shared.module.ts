import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database-config/database/database.module';
import { clientProviders } from '../client.providers';
import { CommonService } from '../services/common/common.service';

@Module({
  imports: [DatabaseModule],
  exports: [CommonService, DatabaseModule, ...clientProviders],
  providers: [CommonService, ...clientProviders],
})
export class ClientSharedModule {}
