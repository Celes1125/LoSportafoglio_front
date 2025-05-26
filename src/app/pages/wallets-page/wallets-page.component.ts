import { Component, EventEmitter, Output } from '@angular/core';
import { WalletService } from '../../core/services/wallet.service';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Wallet } from '../../core/interfaces/wallet';
import { SharedService } from '../../core/services/shared.service';
import { lastValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-wallets-page',
  standalone: true,
  templateUrl: './wallets-page.component.html',
  styleUrl: './wallets-page.component.css',
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, FormsModule, MatDialogModule]
})
export class WalletsPageComponent {
  wallets!: any
  dataSource: any = []
  selection = new SelectionModel<any>(false, [])
  labelPosition: 'before' | 'after' = 'before';
  @Output() changesOnWalletsArray = new EventEmitter<void>();
  constructor(
    private walletService: WalletService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private router: Router,
    
  ) {
    this.getAllWallets()
  }
  async getAllWallets(): Promise<void> {
    try {
      const response = await lastValueFrom(this.walletService.getAll());
      this.wallets = response;
      this.dataSource = new MatTableDataSource(this.wallets);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      
    }
  }
  handleChange(value: Wallet) {
    this.sharedService.setSelectedValue(value);
  }
  displayedColumns: string[] = ['check', 'edit', 'delete'];
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(element?: any): string {
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'} row ${element.position + 1}`;
  }
  showWalletAtHome(wallet: Wallet) {
    this.selection.clear();
    this.selection.select(wallet);
    this.handleChange(wallet)
  }
  async openCreateWalletDialog() {
    try {
      const { CreateWalletDialogComponent } = await import('../../share/dialogs/create-wallet-dialog/create-wallet-dialog.component');
      const dialogRef = this.dialog.open(CreateWalletDialogComponent, {
        data: { wallets: this.wallets }
      })
      dialogRef.afterClosed().subscribe(
        response => {
          if (response) {
            this.getAllWallets()
          };
        })
    } catch (error) {
      console.log('error loading dialog', error)
    }

  }
  async openEditWalletDialog(walletId:string) {
    try {
      const { EditWalletDialogComponent } = await import('../../share/dialogs/edit-wallet-dialog/edit-wallet-dialog.component');
      const dialogRef = this.dialog.open(EditWalletDialogComponent, {
        data: {
          walletId: walletId,
        }
      })
      dialogRef.afterClosed().subscribe(
        response => {
          if (response) {
            alert("wallet edited ok")
            this.getAllWallets()              
          }
        });
    } catch (error) {
      console.log('error loading dialog', error)
    }
  }
  async openDeleteWalletDialog(wallet: Wallet) {
    try {
      const { DeleteWalletDialogComponent } = await import('../../share/dialogs/delete-wallet-dialog/delete-wallet-dialog.component');
      const dialogRef = this.dialog.open(DeleteWalletDialogComponent, {
        data: {
          wallet: wallet,
        }
      })
      this.dataSource
      dialogRef.afterClosed().subscribe(async () => {
        this.selection.clear();
        this.sharedService.setSelectedValue(null)
        await this.getAllWallets()
        this.changesOnWalletsArray.emit();
        //this.router.navigateByUrl('/dashboard/home')
        
      });
    } catch (error) {
      console.log('error loading dialog', error)
    }
  }
}