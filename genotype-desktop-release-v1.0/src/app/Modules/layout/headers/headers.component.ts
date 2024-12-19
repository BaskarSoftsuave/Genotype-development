import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProfilePopupComponent } from '../../project/profile-popup/profile-popup.component';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {HeaderService} from '../header.service';
import {ToastrService} from "ngx-toastr";
import { MatMenuTrigger } from '@angular/material/menu';
import { IndexedDbApiService } from '../../../indexedDb/db.api.service';
@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit,OnDestroy {
  username!: string;
  email!: string ;
  userDetails: any = localStorage.getItem('userDetails');
  licenceExpireMessage
  showLicenceExpireMessage = false

  constructor(public dialog: MatDialog,
              private headerService: HeaderService,
              private router: Router,
              private indexedDbApiService:IndexedDbApiService,
              private toaster:ToastrService) { }

  ngOnInit(): void {
    console.log(this.userDetails);
    this.userDetails = JSON.parse(this.userDetails);
     this.email = this.userDetails.email;
     this.username = this.userDetails.firstName;
    //  this.checkLicenceValidityLocaly()
  }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild('menu',{ static: true }) menu!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    let target = event.target as HTMLElement;
    if (!target?.hasAttribute('data-menu-element')) {
      if(this.trigger){
        this.trigger?.closeMenu();
      }
    }
  }

  open(value: any){
    const addUserDialog = this.dialog.open(ProfilePopupComponent, {
      panelClass: ['app-profile-popup'],
      width: '700px',
      height: 'auto',
    });
    addUserDialog.componentInstance.formTitle = value;

    addUserDialog.afterClosed().subscribe(result => {
    });
  }


  logout(){
   const token =  localStorage.getItem('token');
   if(localStorage.getItem('isOnline') == 'true'){
     this.headerService.logout(token).subscribe((response: any)=>{
        console.log(response);
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userDetails');
        this.toaster.success(response.message);
        this.router.navigate(['login']);
      });
    }else{
      this.toaster.error('Internet connection is needed !!');
    }
  }

  checkLicenceValidityLocaly(){
    this.indexedDbApiService.checkLicenceValidity().then((LicenceValidity)=>{
      if(LicenceValidity?.isLicenceValid){
        if(LicenceValidity?.expiryInHours){
          let licenceExpireInDays = Math.floor(LicenceValidity?.expiryInHours / 24)
          if(licenceExpireInDays <= 7){
            this.showLicenceExpireMessage = true
          }else if(licenceExpireInDays <= 31){
            this.toaster.warning(`Licence will Expiry In ${licenceExpireInDays} Days`)
          }
          this.licenceExpireMessage =  `Licence Expiry In ${LicenceValidity?.expiryInHours < 24 ? LicenceValidity?.expiryInHours + ' hours ' : licenceExpireInDays +' days '}`
          console.log(`LicenceValidity.expiryIn ${LicenceValidity?.expiryInHours < 24 ? LicenceValidity?.expiryInHours + ' hours ' : licenceExpireInDays +' days '}`, LicenceValidity?.expiryInHours)
        }
      }else{
        console.log("LicenceValidity ",LicenceValidity)
        this.toaster.error(LicenceValidity?.message);
        this.router.navigate(['home']);
      }
    })
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onClick);
  }

}
