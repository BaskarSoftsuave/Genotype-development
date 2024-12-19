import { Injectable } from '@angular/core';
import {API} from '../../Utils/constant';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) { }
  login(model: any){
    return this.http.post<any>(API.userLogin,model);
  }

  verifyLicence(model: any){
    return this.http.post<any>(API.licenseVerify,model);
  }
  verifyDevice(deviceId: string){
    return this.http.get<any>(API.deviceVerify+ '?&deviceId=' + deviceId);
  }
  isAuthenticated(): boolean {
    return !!JSON.parse(<string>localStorage.getItem('isLoggedIn'));
  }

  isTokenExpires(): boolean{
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
