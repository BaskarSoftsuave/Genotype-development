import {Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../services/login.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup;
  submitted = false;

  constructor(private route: Router,
              private fb:FormBuilder,private loginService:LoginService,
              private toaster: ToastrService) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  get f() { return this.loginForm.controls; }

  login() {
    let loginDetails;
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.submitted = true;
      loginDetails = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.loginService.login(loginDetails).subscribe((response:any)=>{
        if(response.statusCode == 200){
          console.log(response);
          this.toaster.success('Login Successfully')
          localStorage.setItem('adminEmail',this.loginForm.value.email)
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('isLoggedIn', String(true));
          this.route.navigate(['admin/licence/list']);
        }else{
          console.log(response);
          this.toaster.error('Invalid Credentials ')
        }
      })

    }
  }

}
