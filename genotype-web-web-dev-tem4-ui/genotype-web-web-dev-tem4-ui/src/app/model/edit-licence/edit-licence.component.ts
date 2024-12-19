import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "../dialog.service";
import {ToastrService} from "ngx-toastr";
import {DateLessThanOrEqualsValidator} from "../add-Licence/add-Licence.component";

@Component({
  selector: 'app-edit-licence',
  templateUrl: './edit-licence.component.html',
  styleUrls: ['./edit-licence.component.scss']
})
export class EditLicenceComponent implements OnInit {

  editLicenceForm!: FormGroup;
  submitted = false;
  licenceData: any;
  constructor(private dialogRef: MatDialogRef<EditLicenceComponent>,
              private fb:FormBuilder,
              private dialogService:DialogService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.licenceData = JSON.parse(<any>localStorage.getItem('licenceData'))
    console.log(this.licenceData);
    this.editLicenceForm = this.fb.group({
      company_name:[this.licenceData.company_name,[Validators.required]],
      no_of_user:[this.licenceData.userLimit,[Validators.required,Validators.pattern("^[0-9]*$")]],
      isLifeLongLicence:[this.licenceData.isLifeLongLicence ,Validators.required],
      start_date:[this.licenceData.Start_date,[Validators.required,DateLessThanOrEqualsValidator('end_date')]],
      end_date:[this.licenceData.isLifeLongLicence ? '':this.licenceData.Expire_date,[Validators.required,DateLessThanOrEqualsValidator('start_date')]],
    })
  }

  get f() {
    return this.editLicenceForm.controls;
  }
  save(){
    let licenseDetails;
    const data = JSON.parse(<any>localStorage.getItem('licenceData'));
    console.log(data);
    if(this.editLicenceForm.invalid){
        this.submitted = true;
    }else{
      this.submitted = true;
      console.log(data);
      licenseDetails = {
        licenceId:data.licenceId,
        isLifeLongLicence:this.editLicenceForm.value.isLifeLongLicence,
        startDate:this.editLicenceForm.value.start_date,
        endDate: !this.editLicenceForm.value.isLifeLongLicence ? this.editLicenceForm.value.end_date : 'Eternal',
        companyName:this.editLicenceForm.value.company_name,
        noOfUser:this.editLicenceForm.value.no_of_user,
      }
      console.log(licenseDetails);
      this.dialogService.editLicence(licenseDetails).subscribe((response:any)=>{
        console.log(response.message);
        if(response.statusCode === 200){
          this.toastr.success('License Updated Successfully');
          this.dialogRef.close(response);
        }else{
          this.toastr.error('Error while updating License. Please try again');
          this.dialogRef.close(response);
        }
      });

    }


  }

  close(){
    this.dialogRef.close();
  }

}
