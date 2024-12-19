import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { API } from '../Utils/constant';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DialogService {


  constructor(private http: HttpClient) {

  }

  addLicence(model:any){
       return this.http.post(API.addLicence,model);
  }

  addUser(modal:any){
    return this.http.post(API.addUser, modal);
  }

  deleteLicence(modal:any){
    let params = {
      licenceId:modal.licenceId
    }
    return this.http.delete<any>(API.deleteLicense,{params});
  }

  deleteUser(modal:any){
    let params = {
      userId:modal.userId
    }
    return this.http.delete(API.deleteUser,{params});
  }


  editUser(modal:any){
    return this.http.put(API.editUser,modal);
  }

  editLicence(modal:any){
    return this.http.put(API.editLicence,modal);
  }
}
