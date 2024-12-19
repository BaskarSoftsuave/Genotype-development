import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicenceRoutingModule } from './licence-routing.module';
import { LicenceListComponent } from './licence-list/licence-list.component';
import {MatTableModule} from "@angular/material/table";
import { UsersComponent } from './users/users.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from 'ngx-pagination';
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    LicenceListComponent,
    UsersComponent,
  ],
    imports: [
        CommonModule,
        LicenceRoutingModule,
        MatTableModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatDialogModule,
        MatButtonModule,
        MatRippleModule,
        MatSortModule,
        NgbModule,
        NgxPaginationModule,
        MatInputModule
    ]
})
export class LicenceModule { }
