import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [LoginComponent],
    imports: [CommonModule, SharedModule, LoginRoutingModule, ReactiveFormsModule]
})
export class LoginModule {}
