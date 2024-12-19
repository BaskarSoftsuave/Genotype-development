import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeadersComponent} from './headers/headers.component';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [HeadersComponent],
  exports:[HeadersComponent],
    imports: [
        CommonModule, RouterModule, MatCardModule, MatMenuModule, MatButtonModule, MatDialogModule,FormsModule, ReactiveFormsModule
    ]
})
export class LayoutModule { }
