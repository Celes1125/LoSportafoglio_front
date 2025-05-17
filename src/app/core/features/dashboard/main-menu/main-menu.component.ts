import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-main-menu',
  imports: [],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  router: Router
  @Output()
  homeFlag: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output()
  walletFlag: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output()
  reportFlag: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private _route: Router,

  ) {
    this.router = this._route
  }

  sendHomeFlag() {
    this.homeFlag.emit(true)
  }

  sendWalletFlag() {
    this.walletFlag.emit(true)
  }

  sendReportFlag() {
    this.reportFlag.emit(true)
  }

  logout() {
    localStorage.removeItem('token');
    alert('See you later!');
    this.router.navigateByUrl('login').then(() => {
      window.location.reload();
    });
  }  


}
