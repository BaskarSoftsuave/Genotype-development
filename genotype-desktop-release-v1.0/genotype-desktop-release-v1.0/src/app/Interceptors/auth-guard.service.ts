import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, Router} from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private auth: AuthService,
              public router: Router) { }


  canActivate(): boolean{
    if(!this.auth.isAuthenticated()){
      console.log('no token');
      this.router.navigateByUrl('');
      return false;
    }
    console.log('Valid token');
    return true;
  }
}
