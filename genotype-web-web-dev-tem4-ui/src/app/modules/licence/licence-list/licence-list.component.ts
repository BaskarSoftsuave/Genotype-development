import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddLicenceComponent} from "../../../model/add-Licence/add-Licence.component";
import {DeleteUserComponent} from "../../../model/delete-user/delete-user.component";
import {AddUserComponent} from "../../../model/add-user/add-user.component";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {LicenceService} from "../licence.service";
import {EditLicenceComponent} from "../../../model/edit-licence/edit-licence.component";



@Component({
  selector: 'app-licence-list',
  templateUrl: './licence-list.component.html',
  styleUrls: ['./licence-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LicenceListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['company_name', 'No_of_Users', 'Start_date', 'Expire_date', 'status', 'action'];
  dataSource!: MatTableDataSource<Element>;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  expiryColor: any;
  public pageSizeOptions = [5, 10, 25, 50, 100, 250, 500];
  public licenceListCount = 0;
  public page = 0;
  public itemsPerPage = 6;
  public order = -1;
  searchValue = ''



  constructor(private route: Router, private fb: FormBuilder, public dialog: MatDialog, private licenceService:LicenceService) {

  }


  ngOnInit(){
    console.log("LICENSE CREATED", this.route.url);
    this.getLicenceList();
  }
ngOnDestroy(): void {
  console.log("LICENSE DESTROY", this.route.url);
  
}
  getLicenceList() {
    const filter = {
      limit: this.itemsPerPage,
      page: this.page,
      order: this.order,
      search: this.searchValue
    };
    console.log(filter);
    this.licenceService.licenceList(filter).subscribe((response:any)=>{
      if(response.statusCode === 200){
        console.log('licenceList', response.data);
        let licence: any = [];
        for(let x of response.data.licenceList){
          if(x.isDeleted == false){
            let status : any;
            let date:any ;
            if(x.isLifeLongLicence ){
              date= new Date() 
            }else{
              date = new Date(x.endDate);
            }
            date = date.toISOString().slice(0,10);
            let currentDate:any = new Date();
            currentDate = currentDate.toISOString().slice(0,10)
            if(date >= currentDate){
              status = 'Active';
              this.expiryColor = 'limegreen';
            }else{
              status = 'Expired';
              this.expiryColor = 'crimson';
            }
            let data = {
              Licence_Number:x.licenceNo,
              company_name: x.companyName,
              No_of_Users: x.userIds.length,
              isLifeLongLicence:x.isLifeLongLicence,
              Start_date: x.startDate,
              Expire_date:x.endDate,
              status: status,
              color:this.expiryColor,
              licenceId: x._id,
              userLimit:x.noOfUser,
            }
            licence.push(data);
          }
        }
        this.dataSource = new MatTableDataSource(licence);
        this.dataSource.sort = this.sort;
        this.licenceListCount = response.data.licenceCount
      }
    });
  }


  addLicence() {

    const addUserDialog = this.dialog.open(AddLicenceComponent, {
      panelClass: ['app-add-Licence'],
      width: '700px',
      height: 'auto',
    });

    addUserDialog.afterClosed().subscribe(result => {
      this.getLicenceList();
    });
  }

  delete(licenceId:any) {
    localStorage.setItem('deleteType','licence');
    localStorage.setItem('licenceId',licenceId);
    const addUserDialog = this.dialog.open(DeleteUserComponent)
    addUserDialog.afterClosed().subscribe(result => {
      this.getLicenceList();
    });
  }

  addUser(data: any) {
    localStorage.removeItem('licenceId')
    localStorage.setItem('licenceData',JSON.stringify(data));
    const addUserDialog = this.dialog.open(AddUserComponent, {
      panelClass: ['app-add-user'],
      width: '700px',
      height: 'auto',
    });

    addUserDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getLicenceList();
    });
  }

  view(data: any) {
    localStorage.setItem('licenceData',JSON.stringify(data));
    this.route.navigate(['admin/licence/user'])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue)
    this.searchValue = filterValue.trim().toLowerCase();
    this.getLicenceList();
  }

  edit(data: any){
    localStorage.setItem('licenceData',JSON.stringify(data));
    const editUserDialog = this.dialog.open(EditLicenceComponent, {
      panelClass: ['app-add-user'],
      width: '700px',
      height: 'auto',
    });

    editUserDialog.afterClosed().subscribe(result => {
      this.getLicenceList();
      console.log('The dialog was closed');
    });
  }
  onChange(event: any): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    console.log(this.page, this.itemsPerPage)
    this.getLicenceList();
  }


}


