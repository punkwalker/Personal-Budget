import { Component, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../data.service'
import { D3jschartComponent } from '../d3jschart/d3jschart.component';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'pb-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements AfterViewInit {

  picture:any;
  name:any = '';
  email:any = '';
  lastLogin:any;
  dbID:any;
  newLogin:boolean = false;
  userForm = this.formBuilder.group({
    name: new FormControl(this.name),
    email: new FormControl(this.email)
  });

  @ViewChild(D3jschartComponent) d3Chart !: any;

  constructor(public auth: AuthService, public dataService:DataService,
    @Inject(DOCUMENT) public document:Document, private formBuilder: FormBuilder, private router:Router) {

  }

  ngAfterViewInit(): void {
    this.auth.user$.subscribe((user:any) => {
      this.picture = user.picture;
      this.name = user.given_name;
      this.email = user.email;
      this.lastLogin = user.updated_at;

      this.userForm.patchValue({
        name: this.name,
        email: this.email
      });

      this.dataService.getUserData(this.email).subscribe((res:any) => {
        if (res.length > 0) {
          this.dbID = res[0]._id;
        }
        else {
          this.newLogin = true;
          //this.dataService.saveUserData(this.name, this.email, this.lastLogin);
        }
      });
    })
  }


  public saveUserDetails(): void {
    this.dataService.saveUserData(this.userForm.value.name, this.userForm.value.email, this.lastLogin).subscribe((res:any) =>{

      if (res.insertedObjects[0].name == this.userForm.value.name)
      {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  logout():void {
    this.auth.logout({
      logoutParams:{
        returnTo: this.document.location.origin
      }
    });
  }

  cancel():void {
    this.router.navigate(['/dashboard']);
  }
}
