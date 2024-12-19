import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import {MatTableModule} from "@angular/material/table";
import {ModelModule} from "../../model";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {CdkTableModule} from '@angular/cdk/table';
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [
    UsersListComponent,
  ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        MatTableModule,
        ModelModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        CdkTableModule,
        MatSortModule,
        MatInputModule,
        MatPaginatorModule
    ]
})
export class UsersModule { }
