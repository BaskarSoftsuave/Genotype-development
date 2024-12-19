import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {DialogService} from "../dialog.service";
import {ToastrService} from "ngx-toastr";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-Licence',
  templateUrl: './add-Licence.component.html',
  styleUrls: ['./add-Licence.component.scss']
})
export class AddLicenceComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  companyId: string | undefined;
  currentD:any;
  constructor(private dialogRef: MatDialogRef<AddLicenceComponent>,
              private fb:FormBuilder,
              private dialogService:DialogService,
              private toaster: ToastrService) {
                this.currentD = new Date().toISOString().substring(0, 10);
              }

  ngOnInit(): void {
    this.loadLicenceForm();
    this.companyId = this.generateCompanyId();
    this.patchCompanyId();
  }


 loadLicenceForm() {
   this.registerForm = this.fb.group({
     Licence_number:['', Validators.required] ,
     company_name:['', Validators.required],
     no_of_user:['',[Validators.required,Validators.pattern("^[0-9]*$")]],
     email: ['', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
     password: ['',Validators.required],
     first_name:['',Validators.required],
     last_name:[''],
     isLifeLongLicence:[false,Validators.required],
     start_date:['',[Validators.required,DateLessThanOrEqualsValidator('end_date')]],
     end_date:['',[Validators.required,DateLessThanOrEqualsValidator('start_date')]],
   })
 }

 patchCompanyId() {
    this.registerForm.patchValue({Licence_number: this.companyId})
 }
 get f() {
  return this.registerForm.controls;
}
  save(){
    let licenseDetails;
    if (this.registerForm.invalid) {
       this.submitted = true;
      //return;
    } else {
      this.submitted = true;
      licenseDetails = {
        licenceNo: this.registerForm.value.Licence_number,
        isLifeLongLicence:this.registerForm.value.isLifeLongLicence,
        startDate: this.registerForm.value.start_date,
        endDate: !this.registerForm.value.isLifeLongLicence ? this.registerForm.value.end_date : 'Eternal',
        companyName:this.registerForm.value.company_name,
        noOfUser:this.registerForm.value.no_of_user,
        user:{
          email: this.registerForm.value.email,
          password:this.registerForm.value.password,
          firstName:this.registerForm.value.first_name,
          lastName:this.registerForm.value.last_name,
        }
      }
      console.log(licenseDetails);

       this.dialogService.addLicence(licenseDetails).subscribe((response:any)=>{
         if(response.statusCode === 200){
           this.toaster.success('License added successfully');
           this.dialogRef.close(response);
         }else{
           this.toaster.error('Error while adding license');
           this.dialogRef.close(response);
         }
        });

    }


  }

  close(){
    this.dialogRef.close();
  }

  generateCompanyId() {
    let outString: string = '';
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      outString += inOptions.charAt(
        Math.floor(Math.random() * inOptions.length)
      );
    }
    return outString;
  }
}

export function DateLessThanOrEqualsValidator(dateCompareControlName: string) {

  let thisDateControl: AbstractControl;
  let otherDateControl: AbstractControl;

  return function DateLessThanOrEqualsValidate(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) {
      return null;
    }
    if (!thisDateControl) {
      thisDateControl = control;
      otherDateControl = control.parent.get(dateCompareControlName) as AbstractControl;
      if (!otherDateControl) {
        throw new Error('dateLessThanOrEqualsValidator(): other control is not found in parent group');
      }
      otherDateControl.valueChanges.subscribe(() => {
        thisDateControl.updateValueAndValidity();
      });
    }
    if (!otherDateControl || !otherDateControl.value) {
      return null;
    }
    const date1 = thisDateControl.value;
    const date2 = otherDateControl.value;
    if(dateCompareControlName == 'start_date'){
      if (date1 !== null && date2 !== null && date1 < date2) {
        return {
          'date_less_than_or_equal': true
        };
      }
    }else{
      if (date1 !== null && date2 !== null && date1 > date2) {
        return {
          'date_less_than_or_equal': true
        };
      }
    }

    return null;
  };
}
