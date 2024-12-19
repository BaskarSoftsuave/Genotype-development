export class AdminLoginDto {
  email: string;
  password: string;
  licenceId: string;
}

export class LicenceVerify {
  licenceId: string;
  deviceId: string;
  licenceNumber: string;
}

export class deviceVerify {
  deviceId: string;
}
