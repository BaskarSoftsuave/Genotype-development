export interface Users extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
}
