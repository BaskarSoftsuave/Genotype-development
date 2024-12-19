export class LicenseDto {
  licenceNo: string;
  companyName: string;
  noOfUser: number;
  isLifeLongLicence:boolean;
  startDate: string;
  endDate: string;
  user: addUser;
}

interface addUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class updateLicenseDto {
  startDate: string;
  endDate: string;
  licenceId: string;
  isLifeLongLicence:Boolean;
}

export class deleteLicenseDto {
  licenceId: string;
}
