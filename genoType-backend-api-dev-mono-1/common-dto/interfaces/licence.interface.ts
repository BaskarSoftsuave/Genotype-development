export interface Licence extends Document {
  licenceId: string;
  licenceNo: string;
  userIds: Array<any>;
  startDate: Date;
  endDate: Date;
  companyName: string;
  noOfUser: number;
  deviceId: string;
  verifiedBy: string;
}
