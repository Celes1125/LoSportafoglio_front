import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WalletComponent } from '../../main/wallet/wallet.component';
import { WalletsPageComponent } from '../wallets-page/wallets-page.component';
import { CategoriesPageComponent } from '../categories-page/categories-page.component';
import { VendorsPageComponent } from '../vendors-page/vendors-page.component';
//Material Design
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PocketsDialogComponent } from '../../dialogs/pockets-dialog/pockets-dialog.component';


@Component({
    selector: 'app-manage-page',
    standalone: true,
    imports: [CommonModule, WalletComponent, MatButtonModule, MatIconModule, MatDialogModule, RouterModule],
    templateUrl: './manage-page.component.html',
    styleUrl: './manage-page.component.css',
})
export class ManagePageComponent {
    router: Router = new Router()
    constructor(
        public dialog: MatDialog
    ) { }

    openAddPocketDialog(wallet: any) {
        const dialogRef = this.dialog.open(PocketsDialogComponent, {
            data: {
                wallet: wallet
            }

        });
        dialogRef.afterClosed().subscribe(
            response => {
                if (response) {
                    alert("pocked added ok")
                    //this.router.navigateByUrl('/dashboard');
                }
            });
    }

    openWalletsPage() {
        const dialogRef = this.dialog.open(WalletsPageComponent, {})

        dialogRef.afterClosed().subscribe(() => {
            alert("wallets changes saved ok")

        }


        )
    }

    openVendorsPage() {
        const dialogRef = this.dialog.open(VendorsPageComponent, {})
        dialogRef.afterClosed().subscribe(
            response => {
                if (response) {
                    console.log('vendors changes saved ok: ', response)
                }
            })
    }

    openCategoriesPage() {
        const dialogRef = this.dialog.open(CategoriesPageComponent, {});
        dialogRef.afterClosed().subscribe(
            response => {
                if (response) {
                    console.log('categories changes saved ok: ', response)
                }
            })
    }
}
