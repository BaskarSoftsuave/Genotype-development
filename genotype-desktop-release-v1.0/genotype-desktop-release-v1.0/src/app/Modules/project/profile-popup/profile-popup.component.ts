import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { HeadersComponent } from '../../layout/headers/headers.component';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ProjectService} from '../../../core/services/project.service';
import { IndexedDbApiService } from '../../../indexedDb/db.api.service';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.scss']
})
export class ProfilePopupComponent implements OnInit {
  formTitle: any;
  profileForm!: FormGroup;
  changePasswordForm: FormGroup;
  profile = false;
  password= false;
  validity= false;
  validityForm: FormGroup;
  disabled: any;
  submitted = false;
  user: any;
  expiryDate: any;
  // isOnline = localStorage.getItem('isOnline')
  constructor(private dialogRef: MatDialogRef<ProfilePopupComponent>,
              private route: Router ,
              private router: ActivatedRoute,
              private fb: FormBuilder,
              private projectService: ProjectService,
              private indexedDbApiService:IndexedDbApiService,
              private toaster: ToastrService) { }


  ngOnInit(): void {
  this.profileFormGroup();
  this.passwordFormGroup();
  if(this.formTitle ==='Profile'){
      this.submitted = false;
      this.profile=!this.profile;
      this.patchValue();

    }
  else if(this.formTitle === 'Change Password'){
    this.submitted = false;
    this.password=!this.password;
    }
  else if(this.formTitle === 'Licence Validity')
    {
      this.submitted = false;
      this.validity=!this.validity;
      this.getValidityDetails();
    }
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  close(){
    this.dialogRef.close();
  }

  patchValue(){
    this.user = JSON.parse(localStorage.getItem('userDetails'));
    console.log(this.user);
    this.profileForm.patchValue({
    firstName: this.user.firstName,
    email: this.user.email,
    lastName: this.user.lastName}
    );
  }

  onClickSubmit(data: any) {
    console.log(data.value);
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      this.submitted = true;
    } else {
      if(localStorage.getItem('isOnline') == 'true'){
        console.log(data.value.newPassword);
        const passwordDetail = {
          oldPassword: data.value.currentPassword,
          newPassword: data.value.newPassword,
          confirmPassword: data.value.confirmPassword
        };
        this.projectService.changePassword(passwordDetail).subscribe((response) => {
          console.log(response);
          if (response.statusCode === 200) {
            this.toaster.success(response.message);
            this.dialogRef.close();
          } else {
            this.toaster.error(response.message);
          }
        });        
      }else{
        this.toaster.error('Internet connection is needed !!')
      }
    }
  }

 profileFormGroup(){
  this.profileForm = this.fb.group({
    email: [''],
    firstName: [''],
    lastName: [''],
   });

 }
 passwordFormGroup(){
  this.changePasswordForm = this.fb.group({
    newPassword: ['',[Validators.required]],
    confirmPassword: ['',[Validators.required]],
    currentPassword: ['',[Validators.required]],
   }, {
    validator: mustMatch('newPassword', 'confirmPassword')
  });
 }
  // getValidityDetails(){
  //   this.user = JSON.parse(localStorage.getItem('userDetails'));
  //   console.log(this.user);
  //   const licenceId = this.user.licenceId;
  //    this.projectService.validityDetails(licenceId).subscribe((response: any)=>{
  //      console.log(response);
  //      if(response.statusCode === 200){
  //        this.expiryDate = response.data[0].endDate;
  //      }else{
  //        console.log(response);
  //      }
  //    });
  // }

  getValidityDetails(){
    this.indexedDbApiService.checkLicenceValidity().then((res)=>{
      if(res.isLicenceValid){
        this.expiryDate = res.licenceValidUpto
      }
    }).catch((error)=>{
      console.log(error);
      this.toaster.error(error)
    })
  }

}


export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
