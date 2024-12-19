import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "../dialog.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DeleteUserComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private dialogService: DialogService, private toaster: ToastrService) { }

  ngOnInit(): void {
  }


  delete(){
    const type = localStorage.getItem('deleteType');
    if(type === 'licence'){
      localStorage.removeItem('deleteType');
      let data = {
        licenceId :localStorage.getItem('licenceId')
      }
      this.dialogService.deleteLicence(data).subscribe((response:any)=>{
        if(response.statusCode === 200){
          console.log(response.message);
          this.toaster.success('License deleted successfully');
          this.dialogRef.close(response);
        }else{
          this.toaster.error('Error while deleting licence')
          this.dialogRef.close(response);
        }
      })
    }else if(type === 'user'){
      const user = JSON.parse(<any>localStorage.getItem('userData'))
      let data = {
        userId : user.userId
      }
      this.dialogService.deleteUser(data).subscribe((response:any)=>{
        if(response.statusCode === 200){
          this.toaster.success('User deleted successFully');
         this.dialogRef.close(response);
        }else{
          this.toaster.error('Error while deleting user');
          this.dialogRef.close(response);
        }
      })
    }


  }


}
