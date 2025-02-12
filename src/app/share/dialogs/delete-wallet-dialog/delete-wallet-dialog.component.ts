import { Component, Inject } from '@angular/core';
import { WalletService } from '../../../core/services/wallet.service';
import { Wallet } from '../../../core/interfaces/wallet';
//Material Design
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-wallet-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-wallet-dialog.component.html',
  styleUrl: './delete-wallet-dialog.component.css'
})

export class DeleteWalletDialogComponent {
  wallet: Wallet;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _walletService: WalletService
  ) {
    this.wallet = this.data.wallet;
  }

  // making a logic delete of the wallets, so movements items keep the wallet data
  logic_delete(): any {
    this._walletService.logic_delete(this.wallet._id).subscribe((response: any) => response)
  }
}



