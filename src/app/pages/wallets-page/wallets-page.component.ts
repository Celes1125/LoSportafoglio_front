import { Component } from '@angular/core';
import { WalletService } from '../../core/services/wallet.service';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { RouterModule, Router } from '@angular/router';
import { Wallet } from '../../core/interfaces/wallet';
import { SharedService } from '../../core/services/shared.service';
import { lastValueFrom } from 'rxjs';
// Material Design
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateWalletDialogComponent } from '../../share/dialogs/create-wallet-dialog/create-wallet-dialog.component';
import { DeleteWalletDialogComponent } from '../../share/dialogs/delete-wallet-dialog/delete-wallet-dialog.component';

@Component({
  selector: 'app-wallets-page',
  standalone: true,
  templateUrl: './wallets-page.component.html',
  styleUrl: './wallets-page.component.css',
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, FormsModule, MatDialogModule, RouterModule]
})
export class WalletsPageComponent {

  wallets!: any
  dataSource: any = []
  selection = new SelectionModel<any>(false, [])
  router: Router = new Router
  labelPosition: 'before' | 'after' = 'before';

  constructor(
    private walletService: WalletService,
    private sharedService: SharedService,
    public dialog: MatDialog
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
      // Manejo del error, si es necesario
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

  openCreateWalletDialog() {
    const dialogRef = this.dialog.open(CreateWalletDialogComponent, {
      data: { wallets: this.wallets }
    })
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.getAllWallets()
        };
      })
  }

  openEditWalletDialog(wallet: Wallet) {
    const dialogRef = this.dialog.open(EditWalletDialogComponent, {
      data: {
        wallet: wallet,
      }
    })
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          alert("wallet edited ok")
          this.getAllWallets()
            ;
        }
      });
  }

  async openDeleteWalletDialog(wallet: Wallet) {
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
      this.router.navigateByUrl('/dashboard')

    });
  }

}