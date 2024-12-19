export class addProject {
  project_name: string;
  instrument_name: string;
  graph_type: string;
  plate_format: string;
  uploadedFileData: Array<any>;
  ntc_calculation: boolean;
  calculatedData: Array<any>;
  userId: string;
  isDeleted: boolean;
}

export class deleteProject{
  projectId: any;
}
