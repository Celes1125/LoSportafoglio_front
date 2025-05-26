import { Component, Inject, OnInit, OnDestroy } from '@angular/core'; 
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Wallet } from '../../../core/interfaces/wallet';
import { WalletComponent } from "../../../core/features/wallet/wallet.component";
import { WalletService } from '../../../core/services/wallet.service';
import { Subscription } from 'rxjs'; 

export interface EditWalletDialogData {
  walletId: string; 
}

@Component({
  selector: 'app-edit-wallet-dialog',
  standalone: true,
  imports: [MatDialogModule, WalletComponent],
  templateUrl: './edit-wallet-dialog.component.html',
  styleUrl: './edit-wallet-dialog.component.css'
})
export class EditWalletDialogComponent implements OnInit, OnDestroy {
  wallet: Wallet | undefined; 
  private walletSubscription: Subscription | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditWalletDialogData, 
    private walletService: WalletService
    
  ) {}
 

  ngOnInit(): void {    
    if (this.data && this.data.walletId) {
      this.walletSubscription = this.walletService.getById(this.data.walletId).subscribe({
        next: (response: Wallet) => {
          this.wallet = response; 
          console.log('EDIT WALLET DIALOG WALLET OBJECT:', this.wallet);
        },
        error: (err: any) => {
          console.error('Error fetching wallet:', err);          
        }
      });
    } else {
      console.error('Wallet ID not provided to dialog');      
    }
  }

  ngOnDestroy(): void {    
    if (this.walletSubscription) {
      this.walletSubscription.unsubscribe();
    }
  }
}
 