import { Component, EventEmitter, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'; 

@Component({
  selector: 'app-bottom-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './bottom-menu.component.html',
  styleUrl: './bottom-menu.component.css'
})
export class BottomMenuComponent {  

  @Output()
  homeFlag : EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output()
  walletFlag : EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output()
  reportFlag : EventEmitter<boolean> = new EventEmitter<boolean>()

  sendHomeFlag(){
    this.homeFlag.emit(true)
  }

  sendWalletFlag(){
    this.walletFlag.emit(true)
  }

  sendReportFlag(){
    this.reportFlag.emit(true)
  }







}
