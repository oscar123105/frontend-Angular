import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    
  ],
  exports: [
    DashboardComponent,
    PagesComponent
  ],

  imports: [
    CommonModule,  
    SharedModule,
    AppRoutingModule
  ]
})
export class PagesModule { }
