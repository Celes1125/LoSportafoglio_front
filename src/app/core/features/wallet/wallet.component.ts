import { PocketComponent } from './../pocket/pocket.component';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Wallet } from '../../interfaces/wallet';
import { User } from '../../interfaces/user';
import { MatIconModule } from '@angular/material/icon';
import { CalcService } from '../../services/calc.service';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Pocket } from '../../interfaces/pocket';

@Component({
    selector: 'app-wallet',
    standalone: true,
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css'],
    imports: [CommonModule, MatTableModule, MatInputModule,
        MatFormFieldModule, MatButtonModule, MatDialogModule, MatIconModule, PocketComponent]
})
export class WalletComponent implements OnInit {

    @Input() wallet: any
    @Input() showAddPocketButton: boolean = true
    pockets!: any
    totalAmount!: string
    netoAmount!: string
    deleteFlag: boolean = true
    users: User[] = [];
    //walletName: string = "wallet name"
    walletSubscription: any
    constructor(
        private walletService: WalletService,
        private calcService: CalcService,
        public dialog: MatDialog,
        private router: Router,
        private cdr: ChangeDetectorRef


    ) { }

    ngOnInit(): void {
        this.getPocketsOfWallet()
        this.getUsersOfTheWallet()
        this.getWalletAmounts()
    }

    refreshData(): void {
        const walletId: string = this.wallet._id;
        this.walletService.getById(walletId).pipe(
            tap((updatedWallet: Wallet) => {
                this.wallet = updatedWallet;
                console.log('Wallet data refreshed:', this.wallet);
            }),
            switchMap((updatedWallet: Wallet) => {
                if (updatedWallet && updatedWallet._id) {
                    console.log('Fetching pockets for wallet ID:', updatedWallet._id);
                    return this.walletService.getPocketsOfWallet(updatedWallet._id).pipe(
                        catchError(err => {
                            console.error("Error fetching pockets:", err);
                            this.pockets = undefined;
                            return EMPTY; // o `throwError(() => err)` si quieres que el error se propague
                        })
                    );
                } else {
                    this.pockets = undefined;
                    return EMPTY;
                }
            }),
            tap((pocketsResponse: Pocket[]) => {
                this.pockets = pocketsResponse;
                console.log('Pockets fetched:', this.pockets);
            }),
            catchError(err => {
                console.error("Error during data refresh (outer):", err);
                this.wallet = undefined;
                this.pockets = undefined;
                return EMPTY;
            }),
            finalize(() => {
                console.log('refresh data ended')
            })
        ).subscribe({});
    }
    getUsersOfTheWallet() {
        if (this.wallet !== undefined) {
            this.users = this.wallet.users
        }
    }
    getPocketsOfWallet() {
        if (this.wallet !== undefined) {
            const id = this.wallet?._id
            this.walletService.getPocketsOfWallet(id).subscribe(
                response => {
                    this.pockets = response
                    this.getWalletAmounts()
                }
            )
        }
    }
    getWalletAmounts() {
        if (this.wallet?._id) {
            const id = this.wallet._id;
            this.calcService.getWalletAmounts(id).subscribe(response => {
                if (response) {
                    this.totalAmount = response.totalAmount;
                    this.netoAmount = response.netoAmount;
                    console.log('AMOUNTS: ', response)
                }

            })
        }

    }
    async openEditWalletNameDialog(wallet: Wallet) {
        try {
            const { EditWalletNameDialogComponent } = await import('../../../share/dialogs/edit-wallet-name-dialog/edit-wallet-name-dialog.component');
            const dialogRef = this.dialog.open(EditWalletNameDialogComponent, {
                data: {
                    wallet: wallet
                }
            });
            dialogRef.afterClosed().subscribe(
                response => {
                    if (response) {
                        this.refreshData();
                        this.cdr.detectChanges()
                    }
                });
        } catch (error) {
            console.error("Error loading dialog component", error);
        }
    }
    async openPocketsDialog(pocketId?: string, deleteFlag?: boolean) {
        try {
            const { PocketsDialogComponent } = await import('../../../share/dialogs/pockets-dialog/pockets-dialog.component');
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
                        this.refreshData();
                        this.cdr.detectChanges();
                    }
                });
        } catch (error) {
            console.error("Error loading dialog component", error);
        }
    }
    async openShareOptionsDialog(wallet: Wallet) {
        try {
            const { ShareOptionsDialogComponent } = await import('../../../share/dialogs/share-options-dialog/share-options-dialog.component');
            const dialogRef = this.dialog.open(ShareOptionsDialogComponent, {
                data: {
                    wallet: wallet,
                    walletId: wallet._id
                }
            });

            dialogRef.afterClosed().subscribe(
                response => {
                    console.log('RESPONSE: ', response)
                    if (response && response.success) {
                        alert('new user for your wallet added ok')
                        this.router.navigateByUrl('/dashboard');
                    } else if (response && response.error) {
                        alert(`Error: ${response.error}`);
                        this.router.navigateByUrl('/dashboard');
                    } else {
                        console.error('No response or operation was cancelled');
                        this.router.navigateByUrl('/dashboard');

                    }
                });

        } catch (error) {
            console.error("Error loading dialog component", error);
        }

    }
    async openAddMovementDialog(movement_type: string) {
        try {
            const { MovementsDialogComponent } = await import('../../../share/dialogs/movements-dialog/movements-dialog.component');
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

        } catch (error) {
            console.error("Error loading dialog component", error);
        }


    }
    ngOnDestroy(): void {
        if (this.walletSubscription) {
            this.walletSubscription.unsubscribe();
        }
    }
}