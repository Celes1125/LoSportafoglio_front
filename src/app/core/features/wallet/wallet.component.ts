import { PocketComponent } from './../pocket/pocket.component';
import { Component, Input, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { PocketsDialogComponent } from '../../../share/dialogs/pockets-dialog/pockets-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Wallet } from '../../interfaces/wallet';
import { EditWalletNameDialogComponent } from '../../../share/dialogs/edit-wallet-name-dialog/edit-wallet-name-dialog.component';
import { ShareOptionsDialogComponent } from '../../../share/dialogs/share-options-dialog/share-options-dialog.component';
import { User } from '../../interfaces/user';
import { MatIconModule } from '@angular/material/icon';
import { MovementsDialogComponent } from '../../../share/dialogs/movements-dialog/movements-dialog.component';

@Component({
    selector: 'app-wallet',
    standalone: true,
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css'],
    imports: [CommonModule, MatTableModule, MatInputModule, RouterModule,
    MatFormFieldModule, MatButtonModule, MatDialogModule, MatIconModule, PocketComponent]
})
export class WalletComponent implements OnInit {


    @Input() wallet!: Wallet
    @Input() showAddPocketButton: boolean = true
    pockets!: any    
    router: Router = new Router;
    totalAmount!: number
    netoAmount!: number
    deleteFlag: boolean = true
    users: User[] = [];
    //selectedWallet: Wallet | null = null

    constructor(
        private walletService: WalletService,
        public dialog: MatDialog,

    ) { }


    ngOnInit(): void {
        this.getPocketsOfWallet()
        this.getUsersOfTheWallet()

    }

    getUsersOfTheWallet () {
        if(this.wallet !== undefined){
            this.users = this.wallet.users
        }
    }
    


    getPocketsOfWallet() {
        if (this.wallet !== undefined) {
            const id = this.wallet._id
            this.walletService.getPocketsOfWallet(id).subscribe(
                response => {
                    this.pockets = response                    
                    this.getAmounts(this.pockets)
                }
            )
        }
    }

   

    getAmounts(pockets: any) {
        this.totalAmount = 0;
        this.netoAmount = 0;

        if (pockets && pockets.length > 0) {
            for (let i = 0; i < pockets.length; i++) {
                // Sumar el valor de la propiedad amount de cada pocket al totalAmount
                this.totalAmount += pockets[i].amount;
            }
            const mainPocket = pockets[0]

            if (mainPocket) {
                this.netoAmount = this.totalAmount - mainPocket.amount
            }


        }
    }
 

    openEditWalletNameDialog(wallet: Wallet) {
        const dialogRef = this.dialog.open(EditWalletNameDialogComponent, {
            data: {
                wallet: wallet
            }
        });

        dialogRef.afterClosed().subscribe(
            response => {
                if (response) {
                    this.router.navigateByUrl('/dashboard');
                }
            });

    }

    openPocketsDialog(pocketId?: string, deleteFlag?: boolean) {
        const dialogRef = this.dialog.open(PocketsDialogComponent, {
            data: {
                wallet: this.wallet,
                pocketId: pocketId,
                deleteFlag: deleteFlag

            }
        });

        dialogRef.afterClosed().subscribe(
            response => {
                if (response) {
                    this.router.navigateByUrl('/dashboard');
                }
            });
    }

    openShareOptionsDialog(wallet: Wallet) {
        const dialogRef = this.dialog.open(ShareOptionsDialogComponent, {
            data: {
                wallet: wallet,
                walletId: wallet._id
            }
        });

        dialogRef.afterClosed().subscribe(
            response => {
                console.log('RESPONSE: ', response)
                if (response &&response.success) {
                    alert('new user for your wallet added ok')
                    this.router.navigateByUrl('/dashboard');
                }else if (response && response.error) {
                    alert(`Error: ${response.error}`);
                    this.router.navigateByUrl('/dashboard');
                } else {
                    console.error('No response or operation was cancelled');
                    this.router.navigateByUrl('/dashboard');

                }                
            });

    }

    openAddMovementDialog(movement_type: string) {
        const dialogRef = this.dialog.open(MovementsDialogComponent, {
            data: {
                wallet: this.wallet,
                walletId: this.wallet ? this.wallet._id : null,
                movement_type: movement_type
            }
        });
        dialogRef.afterClosed().subscribe(
            response => {
                if (response) {
                    alert("movement successfully added")
                    this.router.navigateByUrl('/dashboard');
                }
            });
    }

}

























