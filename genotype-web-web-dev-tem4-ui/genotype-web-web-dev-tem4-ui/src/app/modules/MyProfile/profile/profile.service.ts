import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API} from "../../../Utils/constant";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  profile(){
    return this.http.get<any>(API.adminDetails);
  }
}
