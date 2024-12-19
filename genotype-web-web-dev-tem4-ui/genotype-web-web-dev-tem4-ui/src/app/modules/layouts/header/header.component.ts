import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {
  email: any;

  navLinks = [
    { location: 'licence/list', label: 'License' },
    { location: 'user/list', label: 'Users'},
    { location: 'profile/user-profile', label: 'My Profile' }
  ]

  constructor(private route :Router) { }

  ngOnInit(): void {
    const user = localStorage.getItem('adminEmail');
    this.email = user;
  }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild('menu',{ static: true }) menu!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    let target = event.target as HTMLElement;
    if (!target.hasAttribute('data-menu-element')) {
        this.trigger.closeMenu();
    }
  }

  status!: boolean;
  profile(){
    console.log("HI User");
    this.route.navigate(['admin/profile/user-profile'])
    console.log("HI ....")
  }
  logOut(){
    localStorage.clear();
    this.route.navigate(['login'])
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onClick);
  }

}
