import { Component, OnInit, ViewChild } from '@angular/core';
import { AddUserComponent } from '../../../model/add-user/add-user.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../../../model/delete-user/delete-user.component';
import { UsersService } from '../users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EditUserComponent } from '../../../model/edit-user/edit-user.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  displayedColumns = [
    'companyName',
    'first_name',
    'last_name',
    'email',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  userDetails: any = [];
  public pageSizeOptions = [5, 10, 25, 50, 100, 250, 500];
  public usersListCount = 0;
  public page = 0;
  public itemsPerPage = 6;
  public order = -1;
  searchValue = '';
  public ascSort: boolean = true;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  dataExt: any[] = [];
  constructor(public dialog: MatDialog, private userService: UsersService) {}

  ngOnInit(): void {
    this.getUserList();
    console.log('after search');
  }

  getUserList() {
    this.dataExt = [];
    this.dataSource = new MatTableDataSource<any>();
    this.userDetails = [];
    const filter = {
      limit: this.itemsPerPage,
      page: this.page,
      order: this.order,
      search: this.searchValue,
    };
    console.log(filter);
    this.userService.userList(filter).subscribe((response: any) => {
      console.log('response', response);
      if (response.statusCode === 200) {
        for (let x of response.data.usersList) {
          let users: any = {
            licenceId: x._id,
            licenceNumber: x.data[0].licenceNo,
            companyName: x.data[0].companyName,
            userLimit: x.data[0].userLimit,
            pairs: [],
          };
          for (let user of x.data) {
            let data: any = {
              userId: user.userId,
              first_name: user.firstName,
              last_name: user.lastName,
              email: user.email,
              licenceId: user.licenceId,
              userLimit: user.userLimit,
            };
            users.pairs.push(data);
          }

          this.userDetails.push(users);
        }

        const array = this.userDetails.reduce((current: any, next: any) => {
          next.pairs.forEach((pair: any) => {
            current.push({ companyName: next.companyName, pairs: pair });
          });
          return current;
        }, []);
        console.log(array);
        this.ascSort = true;
        this.processData(array);
        console.log(this.dataExt);
        this.dataSource = new MatTableDataSource(this.dataExt);
        console.log(this.dataSource);
        this.usersListCount = response.data.userCount;
      }
    });
  }

  openModal(data: any) {
    localStorage.removeItem('licenceId');
    data.licenceId = data.pairs.licenceId;
    localStorage.setItem('licenceId', data.licenceId);
    data.userLimit = data.pairs.userLimit;
    localStorage.setItem('licenceData', JSON.stringify(data));
    const addUserDialog = this.dialog.open(AddUserComponent, {
      panelClass: ['app-add-user'],
      width: '500px',
      height: 'auto',
      position: {
        top: '10',
        left: '10',
      },
    });

    addUserDialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
      console.log('The dialog was closed');
    });
  }

  close(data: any) {
    let user = {
      userId: data.pairs.userId,
      firstname: data.pairs.first_name,
      lastName: data.pairs.last_name,
      email: data.pairs.email,
    };
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('deleteType', 'user');
    const addUserDialog = this.dialog.open(DeleteUserComponent, {
      panelClass: ['app-delete-user'],
      width: '500px',
      height: 'auto',
      position: {
        top: '10',
        left: '10',
      },
    });

    addUserDialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
      console.log('The dialog was closed');
    });
  }

  edit(data: any) {
    let user = {
      userId: data.pairs.userId,
      firstname: data.pairs.first_name,
      lastName: data.pairs.last_name,
      email: data.pairs.email,
    };
    localStorage.setItem('userData', JSON.stringify(user));
    const editUserDialog = this.dialog.open(EditUserComponent, {
      panelClass: ['app-add-user'],
      width: '700px',
      height: 'auto',
    });

    editUserDialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
      console.log('The dialog was closed');
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    this.searchValue = filterValue.trim().toLowerCase();
    console.log(this.searchValue);
    console.log('filtered Applied');
    this.ngOnInit();
  }

  onChange(event: any): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.getUserList();
  }

  private processData(data: any) {
    const statesSeen: any = {};

    this.dataExt = data
      .sort((a: any, b: any) => {
        return a.companyName.localeCompare(b.companyName);
      })
      .map((x: any) => {
        const stateSpan = statesSeen[x.companyName]
          ? 0
          : data.filter((y: any) => y.companyName === x.companyName).length;

        statesSeen[x.companyName] = true;

        return { ...x, stateSpan };
      });
  }

  public sorting() {
    if (!this.ascSort) {
      this.dataExt = this.dataExt.sort((a: any, b: any) => {
        return a.companyName.localeCompare(b.companyName);
      });
    } else {
      this.dataExt = this.dataExt.sort((a: any, b: any) => {
        return b.companyName.localeCompare(a.companyName);
      });
    }
    this.ascSort = !this.ascSort;
  }
}
