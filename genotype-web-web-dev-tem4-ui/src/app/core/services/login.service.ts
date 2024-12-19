import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { API } from '../../Utils/constant'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http:HttpClient) {}

  login(model:any){
    return this.http.post(API.adminLogin, model);
  }
  isAuthenticated(): boolean {
    return !!JSON.parse(<string>localStorage.getItem('isLoggedIn'));
  }
}
