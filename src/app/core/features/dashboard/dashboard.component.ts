
import { Component } from '@angular/core';
import { TopMenuComponent } from './menu/top-menu/top-menu.component';
import { BottomMenuComponent } from './menu/bottom-menu/bottom-menu.component';
import { HomeComponent } from '../home/home.component';
import { ManagePageComponent } from '../../../pages/manage-page/manage-page.component';
import { ReportsPageComponent } from '../../../pages/reports-page/reports-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [CommonModule, TopMenuComponent, BottomMenuComponent, HomeComponent, ManagePageComponent, ReportsPageComponent]
})
export class DashboardComponent {
  homeFlag: boolean = true
  manageFlag: boolean = false
  reportFlag: boolean = false

  setHomeFlag(flag: boolean) {
    this.homeFlag = flag
    this.manageFlag = false
    this.reportFlag = false
  }
  setManageFlag(flag: boolean) {
    this.manageFlag = flag
    this.reportFlag = false
    this.homeFlag = false
  }
  setReportFlag(flag: boolean) {
    this.reportFlag = flag
    this.homeFlag = false
    this.manageFlag = false
  }


}
