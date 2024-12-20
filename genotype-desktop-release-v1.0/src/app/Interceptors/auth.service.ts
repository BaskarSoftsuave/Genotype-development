import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean{
       const token = localStorage.getItem('token');
       console.log('checking token',this.jwtHelper.isTokenExpired(token));
       return this.jwtHelper.isTokenExpired(token);
 }
}

