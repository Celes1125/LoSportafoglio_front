import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../services/shared.service';
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../interfaces/wallet';
import { WalletComponent } from '../wallet/wallet.component';
import { WalletsPageComponent } from '../../../pages/wallets-page/wallets-page.component';
import { CreateWalletDialogComponent } from '../../../share/dialogs/create-wallet-dialog/create-wallet-dialog.component';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, MatDialogModule, WalletComponent, WalletsPageComponent,]
})
export class HomeComponent implements OnInit {
  wallets: Wallet[] = [];
  selectedWallet: Wallet | null = null;
  constructor(
    public dialog: MatDialog,
    public walletService: WalletService,
    public sharedService: SharedService
    
  ) { }
  async ngOnInit(): Promise<void> {
    try {
      this.wallets = await lastValueFrom(this.walletService.getAll());
    } catch (error) {
      console.error('Error loading wallets:', error);
      this.wallets = [];
    }
    this.sharedService.selectedValue$.subscribe((wallet) => {
      this.selectedWallet = wallet;
    });
  }
  async refreshingComponent (){
    try {
      this.wallets = await lastValueFrom(this.walletService.getAll());
    } catch (error) {
      console.error('Error loading wallets:', error);
      this.wallets = [];
    }
    this.sharedService.selectedValue$.subscribe((wallet) => {
      this.selectedWallet = wallet;
    });
  }
  openCreateWalletDialog() {
    const dialogRef = this.dialog.open(CreateWalletDialogComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.refreshingComponent()        
      };
    }
    );
  }

}

