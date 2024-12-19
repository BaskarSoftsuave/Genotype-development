import { Connection } from 'mongoose';
import { AdminUserSchema, UserSchema, LicenseSchema } from './user/user.schema';

export const AuthProviders = [
  {
    provide: 'ADMIN_USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('admin-users', AdminUserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('users', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'LICENCE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('licences', LicenseSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
