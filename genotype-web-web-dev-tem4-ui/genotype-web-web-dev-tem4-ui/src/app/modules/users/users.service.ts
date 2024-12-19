import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { API } from '../../Utils/constant';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  userList(filter: any):any{
      return this.http.get<any>(API.usersList + '?&filter=' + JSON.stringify(filter));
  }
}
