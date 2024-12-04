import { Component, Inject } from '@angular/core';
import { Wallet } from '../../../core/interfaces/wallet';
import { WalletComponent } from '../../../core/features/wallet/wallet.component';
import { WalletService } from '../../../core/services/wallet.service';
//Material Design
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-edit-wallet-name-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, WalletComponent, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-wallet-name-dialog.component.html',
  styleUrl: './edit-wallet-name-dialog.component.css'
})
export class EditWalletNameDialogComponent {
  wallet: Wallet;
  newName: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(WalletService) private _walletService: WalletService,

  ) {
    this.wallet = this.data.wallet
  }

  editWalletName() {
    let newWallet = {
      _id: this.wallet._id,
      name: this.newName.toUpperCase()
    }
    this._walletService.edit(newWallet).subscribe(
      response => response
    )

  }


}
