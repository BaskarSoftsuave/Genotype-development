import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import {LayoutsModule} from "../../modules/layouts/layouts.module";



@NgModule({
  declarations: [
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    LayoutsModule,
  ]
})
export class AdminLayoutModule { }
