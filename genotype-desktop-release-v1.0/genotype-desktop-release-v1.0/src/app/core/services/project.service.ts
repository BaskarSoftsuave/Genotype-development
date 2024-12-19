import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {API} from '../../Utils/constant';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public excelData: any;

  // public GraphType:string;
  // public isGraph2X : boolean;
  // public projectDetails:any;
  // public excelCollection:any;
  // public dataCollection:any;
  // public excelCellDetails:any;
  
  constructor(private http: HttpClient) { }

  changePassword(model: any){
    const token  = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(API.changePassword,model,{headers: reqHeaders});
  }

  validityDetails(licenceId: any){
    const token  = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(API.licenceDetail+ '?licenceId=' + licenceId,{headers: reqHeaders});
  }

  projectList(filter: any ){
    const token  = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(API.projectList+ '?&filter=' + JSON.stringify(filter),{headers: reqHeaders});
  }

  addProject(model: any ){
    const token  = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(API.addProject,model,{headers: reqHeaders});
  }

  deleteProject(model: any ){
    const params = {
      projectId:model.projectId
    };
    const token  = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<any>(API.deleteProject,{params, headers: reqHeaders});
  }
}
