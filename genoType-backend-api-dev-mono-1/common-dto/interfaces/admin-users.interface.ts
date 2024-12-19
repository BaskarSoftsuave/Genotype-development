export interface AdminUsers extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
}
