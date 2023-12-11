import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import{ContactComponent} from './contact/contact.component';
import { P404Component } from './p404/p404.component';
import { UserProfileComponent } from './user-profile/user-profile.component'
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path:'',
    component: HomepageComponent,
    pathMatch: 'full'
  },
  {
    path:'about',
    component: AboutComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'contact',
    component: ContactComponent,
  },
  {
    path:'profile',
    component: UserProfileComponent
  },
  {
    path:'dashboard',
    component: DashboardComponent
  },
  {
    path:'**',
    component: P404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
