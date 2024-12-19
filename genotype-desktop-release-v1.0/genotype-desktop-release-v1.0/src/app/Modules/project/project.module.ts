import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectRoutingModule} from './project-routing.module';
import {ProjectListComponent} from './project-list/project-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { CreateProjectComponent } from './create-project/create-project.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { DataCollectionComponent } from './data-collection/data-collection.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CreateReportComponent } from './create-report/create-report.component';
import {MatMenuModule} from '@angular/material/menu';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRippleModule} from '@angular/material/core';
import { ReportViewComponent } from './report-view/report-view.component';
import {ChartsModule} from 'ng2-charts';
import { ActionPopupComponent } from './action-popup/action-popup.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [ProjectListComponent, CreateProjectComponent, DataCollectionComponent, CreateReportComponent, ProfilePopupComponent, ReportViewComponent, ActionPopupComponent],
    imports: [
        CommonModule,
        ProjectRoutingModule,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatMenuModule,
        FormsModule,
        MatDialogModule,
        MatRippleModule,
        ChartsModule,
        MatPaginatorModule,
        PlotlyModule
    ],
    entryComponents: [ProfilePopupComponent]
})
export class ProjectModule { }
