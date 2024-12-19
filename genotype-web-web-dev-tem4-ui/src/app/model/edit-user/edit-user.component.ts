import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {DialogService} from "../dialog.service";


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editUserForm!:FormGroup;
  submitted = false;
  userData: any;

  constructor(private dialogRef: MatDialogRef<EditUserComponent>,
              private fb:FormBuilder,
              private dialogService: DialogService,
              private toaster : ToastrService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(<any>localStorage.getItem('userData'));
    console.log(this.userData);
    this.submitted = true;
    this.editUserForm = this.fb.group({
      first_name:[this.userData.firstname, Validators.required],
      last_name:[this.userData.lastName],
      email: [this.userData.email,Validators.compose([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
    })
  }

  close(){
    this.dialogRef.close();
  }
  get f() {
    return this.editUserForm.controls;
  }
  save(){
    let userDetails;
    const data = JSON.parse(<any>localStorage.getItem('userData'))
    if(this.editUserForm.invalid){
      this.submitted = true;
    }else{
      this.submitted = true;
      userDetails = {
        userId: data.userId,
        firstName: this.editUserForm.value.first_name,
        lastName: this.editUserForm.value.last_name,
        email: this.editUserForm.value.email,
      }
      console.log(userDetails);
      this.dialogService.editUser(userDetails).subscribe((response:any)=>{
        if(response.statusCode === 200){
          this.toaster.success('User Updated Successfully');
          this.dialogRef.close(response);
        }else{
          console.log(response);
          this.toaster.error('Error while updating user. Please try again');
          this.dialogRef.close(response);
        }
      });
    }
  }
}
