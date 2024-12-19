import * as config from 'config';
import * as mongoose from 'mongoose';
const dbConfig = config.get('database');
import { Connection } from 'mongoose';
import { licenceSchema } from './schema/license.schema';
import { UsersSchema } from './schema/user.schema';
import { ProjectSchema } from './schema/project.schema';
import { AdminUserSchema } from './schema/AdminUser.schema';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(dbConfig.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
  },

  // clientProviders
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

    // AuthProviders 
      {
        provide: 'ADMIN_USER_MODEL',
        useFactory: (connection: Connection) =>
          connection.model('admin-users', AdminUserSchema),
        inject: ['DATABASE_CONNECTION'],
      }
];
