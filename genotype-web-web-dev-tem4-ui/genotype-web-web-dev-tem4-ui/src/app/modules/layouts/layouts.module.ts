import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from "@angular/material/tabs";
import {RouterModule} from "@angular/router";
import {NgbButtonsModule} from "@ng-bootstrap/ng-bootstrap";




@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
    imports: [
        CommonModule,
        MatTooltipModule,
        MatButtonModule,
        MatMenuModule,
        MatTabsModule,
        RouterModule,
        NgbButtonsModule,

    ]
})
export class LayoutsModule { }
