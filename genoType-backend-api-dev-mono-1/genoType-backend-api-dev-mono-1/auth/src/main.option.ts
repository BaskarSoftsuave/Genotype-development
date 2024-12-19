import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import * as config from 'config';
const serverConfig = config.get('server');
export const OPTIONS: NestMicroserviceOptions & MicroserviceOptions = {
  transport: Transport.REDIS,
  options: {
    url: serverConfig.URL,
  },
};
