import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ProjectListComponent} from './project-list/project-list.component';
import {CreateProjectComponent} from './create-project/create-project.component';
import {DataCollectionComponent} from './data-collection/data-collection.component';
import {CreateReportComponent} from './create-report/create-report.component';
import {ReportViewComponent} from './report-view/report-view.component';

const routes: Routes = [
  {
    path:'list',
    component: ProjectListComponent
  },
  {
    path:'add_project',
    component: CreateProjectComponent
  },
  {
    path:'data_collection',
    component: DataCollectionComponent
  },
  {
    path:'generate_report',
    component:CreateReportComponent
  },
  {
    path:'report_view',
    component:ReportViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
