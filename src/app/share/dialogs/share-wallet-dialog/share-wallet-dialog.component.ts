import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-share-wallet-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './share-wallet-dialog.component.html',
  styleUrl: './share-wallet-dialog.component.css'
})
export class ShareWalletDialogComponent {
  userEmail: string = '';
  wallet: any;
  newUserId:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(WalletService) private _walletService: WalletService,
    @Inject(UserService) private _userService: UserService
  ) {
    this.wallet = this.data.wallet
  }

  addNewUserToMyWallet(){
    this._userService.getUserByEmail(this.userEmail).subscribe((response:any) => {
      this.newUserId = response._id
    })
    const newWallet= {...this.wallet, users: [...this.newUserId]}
    this._walletService.edit(newWallet)

  }

  
}
