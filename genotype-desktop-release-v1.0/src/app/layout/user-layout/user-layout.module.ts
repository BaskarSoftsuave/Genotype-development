import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserLayoutRoutingModule} from './user-layout-routing.module';
import {UserLayoutComponent} from './user-layout.component';
import {LayoutModule} from '../../Modules/layout/layout.module';



@NgModule({
  declarations: [UserLayoutComponent],
  imports: [
    CommonModule,
    UserLayoutRoutingModule,LayoutModule
  ]
})
export class UserLayoutModule { }
