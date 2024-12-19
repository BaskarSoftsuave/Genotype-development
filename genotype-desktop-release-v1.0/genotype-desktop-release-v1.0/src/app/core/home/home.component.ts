import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from '../services/login.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { IndexedDbApiService } from '../../indexedDb/db.api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  description: string | undefined =' ';
  submitted: boolean;
  licenceForm: FormGroup;
  deviceId: string;
  constructor(private router: Router,
              private fb: FormBuilder,
              private loginService: LoginService,
              private toaster: ToastrService,
              private indexedDbApiService:IndexedDbApiService
              ) {
    this.deviceId = localStorage.getItem('deviceId');
    // this.verifyDeviceWithLicence();
    this.checkLicenceValidityLocaly()
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    // eslint-disable-next-line max-len
    this.description = 'Lorem ipsum dolor sit amet, consectetur adipicising elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n' +
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \n';

    this.licenceForm = this.fb.group({
      licenceNumber: ['',Validators.required]
    });
  }

  get f() { return this.licenceForm.controls; }
  verifyLicence() {
    let licenceData: any;
    this.submitted = true;
    if(this.licenceForm.invalid){
      this.submitted = true;
      console.log('form invalid');
      return;
    } else {
      if(localStorage.getItem('isOnline') == 'true'){
        
        this.submitted = true;
        const device= localStorage.getItem('deviceId');
        licenceData = {
          deviceId : device,
          licenceNumber: this.licenceForm.value.licenceNumber,
        };
        this.loginService.verifyLicence(licenceData).subscribe((response: any) => {
          if(response.statusCode === 200){
            this.toaster.success(response.message);
            localStorage.setItem('verifiedLicence', JSON.stringify(response.license));
            this.indexedDbApiService.addLicence(response.license).then((res)=>{
              this.router.navigate(['login']);
            }).catch((error)=>{
              this.toaster.error(error);
            })
            
          }else{
            this.toaster.error(response.message);
          }
        });
      }else{
        this.toaster.error('Internet connection is needed !!');
      }

    }
  }
  // verifyDeviceWithLicence() {
  //   console.log('this.deviceId', this.deviceId);
  //   if (this.deviceId) {
  //     this.loginService.verifyDevice(this.deviceId).subscribe((response: any) => {
  //       console.log('response ', response);
  //       if (response && response.message === 'Device verified' && response.license) {
  //         localStorage.removeItem('verifiedLicence');
  //         localStorage.setItem('verifiedLicence', JSON.stringify(response.license));
  //         this.router.navigate(['user/project/list']);
  //       }
  //     });
  //   } else {
  //     this.toaster.warning('Device Id Not Found');
  //   }
  // }

  checkLicenceValidityLocaly(){
    this.indexedDbApiService.checkLicenceValidity().then(
      (LicenceValidity)=>{
        if(LicenceValidity?.isLicenceValid){
          localStorage.setItem('verifiedLicence', JSON.stringify(LicenceValidity.licence));
          this.router.navigate(['user/project/list']);
        }else{
          if(LicenceValidity?.message == 'no licence'){
            this.toaster.success('Please verify your licence !!')
          }else if(LicenceValidity?.message == 'licence expired'){
            this.toaster.error('licence expired')
          }else{
            console.log(LicenceValidity?.message)
            this.toaster.error('somthing went wrong')
          }
        }
      }
    )
  }
}
