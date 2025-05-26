import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WalletService } from '../../../core/services/wallet.service';
import { Wallet } from '../../../core/interfaces/wallet';

@Component({
  selector: 'app-create-wallet-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-wallet-dialog.component.html',
  styleUrl: './create-wallet-dialog.component.css'
})
export class CreateWalletDialogComponent implements OnInit {
  walletForm: FormGroup
  userWallets: Wallet[] =[]
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
    this._walletService.getAll().subscribe(response => {
      this.userWallets = response;
      console.log('OnInit user wallets list: ', this.userWallets);
      console.log('OnInit user wallets list: ', response);
    })   

  }
  addWallet() {
    let newWallet = { name: this.walletForm.value.walletName.toUpperCase() };    
    const checkName: boolean = this.userWallets.some((wallet) => wallet.name?.toUpperCase() == newWallet.name.toUpperCase())
    if (checkName) {
      alert('that name is already in use')
      return of(null)
    } else {
      return this._walletService.create(newWallet).subscribe(response => 
        {console.log('new wallet: ', response);  })
    }
  }



}









