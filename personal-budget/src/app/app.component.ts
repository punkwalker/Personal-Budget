import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { JwtHelperService, JWT_OPTIONS   } from '@auth0/angular-jwt';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'pb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
]
})
export class AppComponent implements AfterViewInit {
  title = 'personal-budget';

constructor(@Inject(DOCUMENT) public document:Document, private jwtHelper: JwtHelperService, private auth:AuthService) {}

ngAfterViewInit(): void {
    this.setAccessToken();
  }

public async setAccessToken() {

  this.auth.getAccessTokenSilently({ detailedResponse:true }).subscribe((res:any) => {
      console.log(res);
      var expiry = this.jwtHelper.decodeToken(res.id_token).exp;
      var currentTime = Date.now();

      var showAfter = (expiry * 1000) - 20 - currentTime; // *1000 since Javascript time is shown in milliseconds and JWT token shows seconds elapsed since Epoch
      console.log('current:', currentTime);
      console.log('expiry:', expiry * 1000);
      console.log('show after:',showAfter);
      this.showMessageBeforeTimeout(showAfter);
    });
  }

  private showMessageBeforeTimeout(timeout:number):void{
    setTimeout(() => {
      var cancelAutoRedirect:Boolean = false;

      setTimeout(() => {
        if (!cancelAutoRedirect){
          console.log('logging out...');
          this.auth.logout({
            logoutParams:{
              returnTo: this.document.location.origin
            }
          });
        }
      }, 20000);

      var result = confirm("Session expiring in 20 seconds. Click OK to continue the session. Click CANCEL to logout.");
      if (result == true)
      {
        cancelAutoRedirect = true;
        this.showMessageBeforeTimeout(timeout);
      }
      else {
        this.auth.logout({
          logoutParams:{
            returnTo: this.document.location.origin
          }
        });
      }
    }, timeout);
  }
}
