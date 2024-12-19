import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeleteUserComponent} from "../delete-user/delete-user.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "../dialog.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  addUserForm!: FormGroup;
  submitted = false;
  constructor(private dialogRef: MatDialogRef<AddUserComponent>,
              private fb:FormBuilder,
              private dialogService: DialogService,
              private toaster: ToastrService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      first_name:['', Validators.required],
      last_name:[''],
      email: ['',
        Validators.compose([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', Validators.required],
    })
  }
  get f() {
    return this.addUserForm.controls;
  }

  save(){
    let userDetails;
   // this.submitted = true;
    if(this.addUserForm.invalid){
      this.submitted = true;
      //return;
    }else{
      this.submitted = true;
      let licenceDetails:any = JSON.parse(<string>localStorage.getItem('licenceData'));
      console.log(licenceDetails);
        let licenceId = licenceDetails.licenceId;
        userDetails = {
          firstName: this.addUserForm.value.first_name,
          lastName: this.addUserForm.value.last_name,
          email: this.addUserForm.value.email,
          password: this.addUserForm.value.password,
          licenceId: licenceId
        }
        console.log(userDetails);
        this.dialogService.addUser(userDetails).subscribe((response: any) => {
          console.log(response);
          if (response.statusCode === 200) {
            this.toaster.success('User added successfully')
            this.dialogRef.close(response);
          } else {
            this.toaster.error(response.message);
            this.dialogRef.close(response);
          }
        })
    }
  }


  close(){
    this.dialogRef.close();
  }

}
