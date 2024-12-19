import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';
import {ProjectService} from '../../../core/services/project.service';
import {ToastrService} from 'ngx-toastr';
import { IndexedDbApiService } from '../../../indexedDb/db.api.service';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.scss']
})
export class ActionPopupComponent implements OnInit {
  formTitle: any;
  deleteForm!: FormGroup;
  delete: any;
  view: any;
  // viewProjectForm: FormGroup;
  validity: any;
  // validityForm: FormGroup;
  formData: any;


  constructor(private dialogRef: MatDialogRef<ActionPopupComponent>,
              private projectService: ProjectService,
              private toaster: ToastrService,
              private indexedDbApiService:IndexedDbApiService) { }

  ngOnInit(): void {
    if(this.formTitle === 'Delete'){
      this.delete = true;
    }
  }
  deleteProject(){
    console.log('delete data ');
    const data ={
      // eslint-disable-next-line no-underscore-dangle
      projectId : this.formData._id
      // projectId : this.formData.id // after implement indexed db
    };
    console.log(data);
    // this.projectService.deleteProject(data).subscribe((response: any )=>{
    //   console.log(response);
    //   if(response.statusCode === 200){
    //     console.log(response.message);
    //     this.toaster.success('Project deleted successfully');
    //     this.dialogRef.close(response);
    //   }else{
    //     this.toaster.error('Error while deleting project');
    //     this.dialogRef.close(response);
    //   }
    // });
    this.indexedDbApiService.deleteProject(data.projectId).then((res)=>{
      console.log(res)
      this.toaster.success('Project deleted successfully');
      this.dialogRef.close();
    }).catch((error)=>{
      console.log(error)
      this.toaster.error('Error while deleting project');
      this.dialogRef.close()
    })
  }

  close(){
    this.dialogRef.close();
  }
}
