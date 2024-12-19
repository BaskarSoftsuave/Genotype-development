import { Component, OnInit } from '@angular/core';
import {ProfileService} from "../profile.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  constructor(private profileService: ProfileService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
        });
    this.getProfileDetails();
  }

  getProfileDetails(){
    this.profileService.profile().subscribe((response: any )=>{
      console.log(response);
      if(response.statusCode === 200){
        this.profileForm.patchValue({
          first_name:response.data[0].firstName,
          last_name: response.data[0].lastName,
          email: response.data[0].email,
        })
      }
    })
  }

}
