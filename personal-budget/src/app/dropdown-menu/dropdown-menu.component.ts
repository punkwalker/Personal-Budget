import { Component, Inject } from '@angular/core';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { CommonModule, DOCUMENT, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'pb-dropdown-menu',
  standalone: true,
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  imports: [CdkMenuTrigger, CdkMenu, CdkMenuItem, NgIf, CommonModule],
})
export class DropdownMenuComponent {

  picture:any;
  firstName:string = "";

  constructor(
    @Inject(DOCUMENT) public document:Document,
    public auth: AuthService, private router: Router){
    }

    login(){
      this.auth.isAuthenticated$.subscribe((res:any) => {
        console.log("Inside login");
        console.log(res);
        if (res == false)
        {
          console.log('Inside login');
          this.auth.user$.subscribe((user:any) =>{
            this.picture = user.picture;
            this.firstName = user.firstName;
          })
          this.auth.loginWithRedirect().subscribe((res: any) => {});
        }
        else
        {
          this.auth.logout({
            logoutParams:{
              returnTo: this.document.location.origin
            }
          });
        }
      });
    }

    GotoProfile(){
      this.router.navigate(['/profile']);
    }

    // logout(){
    //   this.auth.logout({
    //     logoutParams:{
    //       returnTo: this.document.location.origin
    //     }
    //   });
    // }
}
