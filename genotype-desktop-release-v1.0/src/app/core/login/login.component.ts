import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../services/login.service';
import {ToastrService } from 'ngx-toastr';
import { IndexedDbApiService } from '../../indexedDb/db.api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted= false;
  description: string | undefined =' ';
  licenceAlive: boolean= true;

  constructor(private router: Router,
              private loginService: LoginService,
              private fb: FormBuilder,
              private toaster: ToastrService,
              private indexedDbApiService:IndexedDbApiService) { 
                const currentState = this.router.getCurrentNavigation()!;
                console.log(" '/login' navigation extra data ", currentState?.extras?.state);
                if(currentState?.extras?.state){
                  this.licenceAlive = currentState.extras.state.licenceAlive
                }
              }

  ngOnInit(): void {
    console.log('LoginComponent INIT');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    // eslint-disable-next-line max-len
    this.description = 'Lorem ipsum dolor sit amet, consecrated advising elite, sed do emus temper incident ut labor et dolore magna aliqua. \n' +
      'Ut enim ad minim veniam, quis nostrud exercitation Alamo laboris nisei ut aliquot ex ea commodo consequat. \n' +
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \n';
  }

  get f() { return this.loginForm.controls; }

  login(){
    const licence = JSON.parse(localStorage.getItem('verifiedLicence'));
    let loginDetails: any;
    this.submitted = true;
    if(this.loginForm.invalid){
      this.submitted = true;
      console.log('form invalid');
      return;
    } else {
      if(localStorage.getItem('isOnline') == 'true'){
        this.submitted = true;
        loginDetails = {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
          // eslint-disable-next-line no-underscore-dangle
          licenceId: licence._id,
          deviceId: localStorage.getItem('deviceId')
        };
        this.loginService.login(loginDetails).subscribe((response: any)=>{
          console.log(response);
          if(response.statusCode === 200){
            console.log(response);
            this.toaster.success('Logged In Successfully');
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('isLoggedIn', String(true));
            localStorage.setItem('userDetails',JSON.stringify(response.data.userDetail));
            this.indexedDbApiService.getUser(response.data.userDetail._id).then((res)=>{
              if(res){
                this.router.navigate(['user/project/list']);
              }else{
                this.indexedDbApiService.addUser(response.data.userDetail).then((res)=>{
                  console.log(res)
                  this.router.navigate(['user/project/list']);
                }).catch((error)=>{
                  console.log(error)
                  this.toaster.error(error)
                })
              }
            }).catch((error)=>{
              console.log(error)
              this.toaster.error(error)
            })
            
          }else {
            console.log(response);
            this.licenceAlive = response?.statusCode == 410 ? false:true;
            this.toaster.error(response.message);
          }
        });

      }else{
        this.toaster.error('Internet connection is needed !!');
      }

    }

  }

}
