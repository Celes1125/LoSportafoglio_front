import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-manage-page',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './manage-page.component.html',
    styleUrl: './manage-page.component.css',
})
export class ManagePageComponent {
    constructor(
        public dialog: MatDialog
    ) { }
    async openAddPocketDialog(wallet: any) {
        try {
            const { PocketsDialogComponent } = await import('../../share/dialogs/pockets-dialog/pockets-dialog.component');
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
        } catch (error) {
            console.error("Error loading dialog component", error);
        }
    }

    async openWalletsPage() {
        try {
            const { WalletsPageComponent } = await import('../wallets-page/wallets-page.component');
            const dialogRef = this.dialog.open(WalletsPageComponent, {})
            dialogRef.afterClosed().subscribe(() => {
                alert("wallets changes saved ok")
            }
            )
        } catch (error) {
            console.error("Error loading dialog component", error);

        }
    }

    async openVendorsPage() {
        try {
            const { VendorsPageComponent } = await import('../vendors-page/vendors-page.component');
            const dialogRef = this.dialog.open(VendorsPageComponent, {})
            dialogRef.afterClosed().subscribe(
                response => {
                    if (response) {
                        console.log('vendors changes saved ok: ', response)
                    }
                })
        } catch (error) {
            console.error("Error loading dialog component", error);
        }
    }

    async openCategoriesPage() {
        try {
            const { CategoriesPageComponent } = await import('../categories-page/categories-page.component');
            const dialogRef = this.dialog.open(CategoriesPageComponent, {});
            dialogRef.afterClosed().subscribe(
                response => {
                    if (response) {
                        console.log('categories changes saved ok: ', response)
                    }
                })
        } catch (error) {
            console.error("Error loading dialog component", error);
        }

    }
}
