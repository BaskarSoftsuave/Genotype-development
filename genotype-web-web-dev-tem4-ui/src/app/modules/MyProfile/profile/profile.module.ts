import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileComponent} from './myprofile/profile.component'
import {ProfileRoutingModule} from "./profile-routing.module";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MatCardModule,
        ReactiveFormsModule
    ]
})
export class ProfileModule { }
