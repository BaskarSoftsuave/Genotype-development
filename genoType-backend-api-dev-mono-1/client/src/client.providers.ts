import { Connection } from 'mongoose';
import { licenceSchema } from './license/license.schema';
import { UsersSchema } from './user/user.schema';
import { ProjectSchema } from './project/project.schema';

export const clientProviders = [
  {
    provide: 'LICENCE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('licences', licenceSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USERS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('users', UsersSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PROJECT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('project', ProjectSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
