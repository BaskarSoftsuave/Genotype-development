import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API} from '../../Utils/constant';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
   baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8000';
  }

  logout(token: any ): Observable<any> {
    //need to change the flow without jwt because to handele the 401 error on this api
    const reqHeaders = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
    return this.http.get<any>(API.userLogout,{headers:reqHeaders});
  }

}
