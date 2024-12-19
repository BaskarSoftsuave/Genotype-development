import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelComponent} from "./model.component";
import { AddUserComponent } from './add-user/add-user.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {DeleteUserComponent} from "./delete-user/delete-user.component";
import {AddLicenceComponent} from "./add-Licence/add-Licence.component";
import {MatCardModule} from "@angular/material/card";
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditLicenceComponent } from './edit-licence/edit-licence.component';
import {MatInputModule} from "@angular/material/input";



@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRippleModule,
    MatCardModule, MatInputModule],
  declarations: [ModelComponent, AddUserComponent,DeleteUserComponent,AddLicenceComponent, EditUserComponent, EditLicenceComponent],
  exports: [ModelComponent]
})
export class ModelModule { }
