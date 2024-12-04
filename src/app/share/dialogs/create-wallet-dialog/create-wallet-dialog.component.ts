import { Observable, of } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from '../../../core/features/wallet/wallet.component';
import { WalletService } from '../../../core/services/wallet.service';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Wallet } from '../../../core/interfaces/wallet';

@Component({
  selector: 'app-create-wallet-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, FormsModule, RouterModule, WalletComponent],
  templateUrl: './create-wallet-dialog.component.html',
  styleUrl: './create-wallet-dialog.component.css'
})
export class CreateWalletDialogComponent implements OnInit {
  walletForm: FormGroup
  userWallets!: Wallet[]
  wallets$: Observable<Wallet[]> = this._walletService.getAll()

  constructor(
    private _formBuilder: FormBuilder,
    private _walletService: WalletService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.walletForm = this._formBuilder.group({
      walletName: ["", [Validators.required]],
    })

  }
  ngOnInit() {
    this.wallets$.subscribe(response => this.userWallets = response)
    console.log('OnInit user wallets list: ', this.userWallets);

  }
  addWallet() {
    let newWallet = { name: this.walletForm.value.walletName.toUpperCase() }
    const checkName: boolean = this.userWallets.some((wallet) => wallet.name?.toUpperCase() == newWallet.name.toUpperCase())
    if (checkName) {
      alert('that name is already in use')
      return of(null)
    } else {
      return this._walletService.create(newWallet).subscribe(response => console.log('new wallet: ', response))
    }
  }



}









