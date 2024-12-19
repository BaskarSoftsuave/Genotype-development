import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModelService} from "../../../model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteUserComponent} from "../../../model/delete-user/delete-user.component";
import {AddUserComponent} from "../../../model/add-user/add-user.component";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {EditUserComponent} from "../../../model/edit-user/edit-user.component";
import {LicenceService} from "../licence.service";


class Todo {
  firstname!: string;
  lastName!: string;
  email!: string;
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  licenceNumber :any;
  licenceId: any;
  displayedColumns: string[] = ['firstname', 'lastName', 'email','action'];
  public pageSizeOptions = [5, 10, 25, 50, 100, 250, 500];
  public usersListCount = 0;
  public page = 0;
  public itemsPerPage = 6;
  public order = -1;
  searchValue = ''

  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
   dataSource!: MatTableDataSource<Todo>;
   addUserForm!: FormGroup;
  constructor(private licenceService:LicenceService,private route:Router,private fb: FormBuilder, public dialog:MatDialog) {

  }

  ngOnInit(): void {
    console.log("USER CREATED", this.route.url);
    this.getUserList();
  }

  ngOnDestroy(): void {
    console.log("USER DESTROY", this.route.url);
  }

  getUserList(){
    let data :any = JSON.parse(<any>localStorage.getItem('licenceData'));
    this.licenceNumber = data.Licence_Number;
    this.licenceId = data.licenceId;
    console.log(data);
    const users:any =[];
    this.licenceService.userList(data.licenceId).subscribe((response:any)=>{
      console.log(response);
      if(response.statusCode === 200){
        for(let x of response.data[0].users){
          let data = {
            userId:x._id,
            firstname: x.firstName,
            lastName: x.lastName,
            email: x.email,
          }
          users.push(data);
        }
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }


  onDelete(data:any){
    localStorage.setItem('userData',JSON.stringify(data));
    localStorage.setItem('deleteType','user');
    const addUserDialog = this.dialog.open(DeleteUserComponent, {
      panelClass: ['app-delete-user'],
      width: '500px',
      height: 'auto',
      position : {
        top: '10',
        left: '10'
      }
    });

    addUserDialog.afterClosed().subscribe(result => {
      this.ngOnInit();
      console.log('The dialog was closed');
    });
  }

  onModal(){
    console.log('Hi...');
    localStorage.setItem('licenceId',this.licenceId);
    const addUserDialog = this.dialog.open(AddUserComponent, {
      panelClass: ['app-add-user'],
      width: '500px',
      height: 'auto',
      position : {
        top: '10',
        left: '10'
      }
    });

    addUserDialog.afterClosed().subscribe(result => {
      this.ngOnInit();
      console.log('The dialog was closed');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  edit(data: any){
    localStorage.setItem('userData',JSON.stringify(data));
    const editUserDialog = this.dialog.open(EditUserComponent, {
      panelClass: ['app-add-user'],
      width: '700px',
      height: 'auto',
    });

    editUserDialog.afterClosed().subscribe(result => {
      this.ngOnInit();
      console.log('The dialog was closed');
    });
  }
  onChange(event: any): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    console.log(this.page, this.itemsPerPage);
    this.getUserList();
  }

}
