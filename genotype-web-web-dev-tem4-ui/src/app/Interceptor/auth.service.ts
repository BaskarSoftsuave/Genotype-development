import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper :JwtHelperService) { }

  public isAuthenticated(): boolean {
    console.log (localStorage['token']);
    const token:any = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
