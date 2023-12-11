import { Component, importProvidersFrom } from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import {provideAnimations} from '@angular/platform-browser/animations';
import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION, MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'pb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],

})

export class MenuComponent {
}


