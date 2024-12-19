import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {ProjectService} from '../../../core/services/project.service';
import {MatSort} from '@angular/material/sort';
import {ActionPopupComponent} from '../action-popup/action-popup.component';
import {MatDialog} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { IndexedDbApiService } from '../../../indexedDb/db.api.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectListComponent implements OnInit,OnDestroy {
  @ViewChild(MatSort,{static: false}) sort!: MatSort;
  displayedColumns: string[] = ['project_name', 'graph_type', 'plate_format', 'instrument_name', 'action'];
  dataSource!: MatTableDataSource<Element>;
  isProject = true;
  public pageSizeOptions = [5, 10, 25, 50, 100, 250, 500];
  public projectListCount = 0;
  public page = 0;
  public itemsPerPage = 6;
  public order = -1;
  orderBy = "project_name"
  searchValue = '';
  unSubscribe :Subject<any> = new Subject<any>()
  searchValueChange :Subject<any> = new Subject<any>()
  constructor(private route: Router,
    private projectService: ProjectService,
    private toaster: ToastrService,
    private indexedDbApiService:IndexedDbApiService,
    public dialog: MatDialog) { }


  ngOnInit(): void {
    this.projectList();
    this.searchDebounce()
  }
  projectList(){
    const filter = {
      limit: this.itemsPerPage,
      page: this.page,
      order: this.order,
      orderBy:this.orderBy,
      search: this.searchValue
    };
    let datas: any = [];
    let userId = JSON.parse(localStorage.getItem('userDetails'))?._id
    // this.projectService.projectList(filter).subscribe((response: any)=>{
    //   console.log(response);
    //   if(response.statusCode === 200){
    //     datas = response.data.projectList;
    //     console.log(datas);
    //     if(datas.length !==0 || this.searchValue.length !==0){
    //       this.isProject = true;
    //       this.dataSource = new MatTableDataSource(datas);
    //       this.dataSource.sort = this.sort;
    //       this.projectListCount = response.data.projectCount;
    //     }else{
    //       this.isProject = false;
    //       this.projectListCount =0 ;
    //     }
    //   }else{
    //     this.isProject = false;
    //     this.projectListCount =0;
    //   }
    // });


    // this.projectService.projectList(filter).subscribe((response: any)=>{
      this.indexedDbApiService.getProject(userId,filter).then((response)=>{
      console.log(response);
        datas = response.data;
        console.log(datas);
        if(datas.length !==0 || this.searchValue.length !==0){
          this.isProject = true;
          this.dataSource = new MatTableDataSource(datas);
          this.dataSource.sort = this.sort;
          this.projectListCount = response.projectCount;
        }else{
          this.isProject = false;
          this.projectListCount =0 ;
        }
    }).catch((error)=>{
      console.log(error)
      this.isProject = false;
      this.projectListCount =0;
    })
  }
  addProject(){
    this.route.navigate(['user/project/add_project']);
  }



  delete(data: any,value: any) {
    const addUserDialog = this.dialog.open(ActionPopupComponent,{
      panelClass: ['app-action-popup'],
      width: '700px',
      height: 'auto',
    });
    addUserDialog.componentInstance.formTitle = value;
    addUserDialog.componentInstance.formData = data;
    addUserDialog.afterClosed().subscribe(result => {
      this.projectList();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log('filterValue', filterValue);
    this.searchValue = filterValue.trim().toLowerCase();
    this.page = 0
    // this.projectList();
    this.searchValueChange.next()
  }

  onChange(event: any): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    console.log(this.page, this.itemsPerPage);
    this.projectList();
  }

  view(data: any){
    data.isView = true;
    if(data.graph_type === 'graph_2'){
      localStorage.setItem('graphType','true');
    }else{
      localStorage.setItem('graphType','false');
    }
    localStorage.setItem('projectDetails', JSON.stringify(data));
    this.route.navigate(['user/project/report_view']);
  }

  searchDebounce(){
    this.searchValueChange.pipe(debounceTime(500),takeUntil(this.unSubscribe)).subscribe((value)=>{
      // console.log(' before projectList( ) in searchDebounce ')
      this.projectList()
    })
  }

  matSortChange(event){
    this.orderBy = event.active,
    this.order = event.direction ? 1 :-1
    this.page = 0
    this.projectList()
  }

  ngOnDestroy(): void {
    this.unSubscribe.next()
    this.unSubscribe.complete()
  }

}
