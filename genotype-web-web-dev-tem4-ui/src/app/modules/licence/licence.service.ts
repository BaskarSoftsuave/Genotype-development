import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { API } from '../../Utils/constant'


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  constructor( private http:HttpClient) { }


  licenceList(filter: any):any{
    return this.http.get<any>(API.licenceList + '?&filter=' + JSON.stringify(filter))
  }

  userList(licenceId:any):any{
    return this.http.get<any>(API.licenceDetail+ '?licenceId=' + licenceId)
  }

}

//let data = {limit: "2"};
// this.httpClient.get<any>(apiUrl, {params: data});
