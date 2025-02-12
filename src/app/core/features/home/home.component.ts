import { SharedService } from '../../services/shared.service';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WalletComponent } from '../wallet/wallet.component';
import { WalletService } from '../../services/wallet.service';
import { MovementsDialogComponent } from '../../../share/dialogs/movements-dialog/movements-dialog.component';
import { WalletsPageComponent } from '../../../pages/wallets-page/wallets-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Wallet } from '../../interfaces/wallet';
import { EmptyError, lastValueFrom, of } from 'rxjs';
import { CreateWalletDialogComponent } from '../../../share/dialogs/create-wallet-dialog/create-wallet-dialog.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [FormsModule, CommonModule, WalletComponent, MatButtonModule, MatIconModule, MatDialogModule, RouterModule, WalletsPageComponent]
})
export class HomeComponent implements OnInit, AfterViewInit {
    router: Router = new Router()
    wallets!: Wallet[]  
    selectedWallet: Wallet | null = null
    @ViewChild('createWallet') createWalletElement!: ElementRef
    @ViewChild('selectWallet') selectWalletElement!: ElementRef
    @ViewChild('showingWallet') showingWalletElement!: ElementRef

    constructor(
        public dialog: MatDialog,
        public walletService: WalletService,
        public sharedService: SharedService
    ) { }

    async ngOnInit(): Promise<any> {
        console.log('OnInit')
        try {
           this.wallets = await lastValueFrom(this.walletService.getAll());
            console.log('Wallets on ngOnInit:', this.wallets);

        } catch (error) {
            if (error instanceof EmptyError) {
                console.warn('no elements in the sequence');
                return of([]); // O cualquier valor predeterminado que desees
            }
            return console.error('Error with ngOnInit promises:', error);
        }

        this.sharedService.selectedValue$.subscribe(response => {
            this.selectedWallet = response;
            this.displayHomeOptions()
            if (response != null) {
                this.selectWalletElement.nativeElement.style = "display:none"
            }
        })
    }

    ngAfterViewInit(): void {
        console.log('afterViewInit')
        console.log('createWalletElement: ', this.createWalletElement)
        console.log('selectWalletElement: ', this.selectWalletElement)
        console.log('showingWalletElement: ', this.showingWalletElement)
        this.displayHomeOptions()

    }

    displayHomeOptions() {
        if (this.wallets?.length >= 1 && this.selectedWallet != null) {
            this.showingWalletElement.nativeElement.style = "display:block"
        }
        if (this.wallets?.length >= 1 && this.selectedWallet == null) {
            this.selectWalletElement.nativeElement.style = "display:block"
        }
        if (this.wallets?.length == 0) {
            this.createWalletElement.nativeElement.style = "display:block"
        }
    }

    openCreateWalletDialog() {
        const dialogRef = this.dialog.open(CreateWalletDialogComponent, {
            data: { }
        });
        dialogRef.afterClosed().subscribe(response => {
            if (response) {                
                this.router.navigateByUrl('/dashboard');
            } 
        });
    }

    
}





