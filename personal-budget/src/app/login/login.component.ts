import { Component, Inject, EventEmitter } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    @Inject(DOCUMENT) public document:Document,
    public auth: AuthService, private router: Router){

    }

    login(){
      console.log("Inside login");

      this.auth.loginWithRedirect().subscribe((res: any) => {
      });
    }

    logout(){
      this.auth.logout({
        logoutParams:{
          returnTo: this.document.location.origin
        }
      });
    }
  }

