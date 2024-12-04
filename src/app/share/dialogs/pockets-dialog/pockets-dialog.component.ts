import { Component, Inject } from '@angular/core';
import { PocketService } from '../../../core/services/pocket.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WalletService } from '../../../core/services/wallet.service';
import { Wallet } from '../../../core/interfaces/wallet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pockets-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  templateUrl: './pockets-dialog.component.html',
  styleUrl: './pockets-dialog.component.css'
})
export class PocketsDialogComponent {
  wallets: Wallet[] = []
  walletOnReception?: any
  defaultWalletValue: string;
  addPocketForm: FormGroup
  editPocketForm: FormGroup
  deleteFlag?: boolean | undefined
  pocketId: any;
  public id!: string

  constructor(
    private _pocketService: PocketService,
    private _walletService: WalletService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.getWallets()
    this.walletOnReception = this.data.wallet
    this.defaultWalletValue = this.walletOnReception._id

    this.addPocketForm = this._formBuilder.group({
      name: [""],
      currency: ["euro", [Validators.required]],
      wallet: [this.defaultWalletValue, [Validators.required]],
    })

    this.editPocketForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      currency: ["euro", [Validators.required]],  // Ensure valid default value
      amount: ["", [Validators.required]],
      wallet: ["", [Validators.required]],
    });

    this.pocketId = this.data.pocketId
    this.getPocket(this.pocketId)
    this.id = this.data.pocketId
    this.deleteFlag = this.data.deleteFlag
  }

  getWallets() {
    return this._walletService.getAll().subscribe(
      (response: Wallet[]) => this.wallets = response
    )
  }

  addPocket() {
    const pocket = {
      name: this.addPocketForm.value.name,
      amount: 0,
      currency: this.addPocketForm.value.currency,
      wallet: this.addPocketForm.value.wallet,

    }
    this._pocketService.create(pocket).subscribe({
      next: (response) => {
        console.log("Pocket created successfully:", response);
        alert("Pocket created successfully!");
      },
      error: (error: { status: number; error: { message: string; }; }) => {
        if (error.status === 400) {
          // Maneja el error 400 específico
          alert("Error: " + error.error.message); // Muestra el mensaje de error recibido desde el backend
        } else {
          // Maneja otros posibles errores
          console.error("Unexpected error:", error);
          alert("An unexpected error occurred.");
        }
      },

    });

  }

  getPocket(id: string) {
    this._pocketService.getById(id).subscribe((response: any) => {
      console.log("pocket response on component: ", response)
      this.editPocketForm.setValue({
        name: response.name,
        currency: response.currency,
        amount: response.amount,
        wallet: response.wallet ? response.wallet._id : ""

      })
    })
  }

  editPocket() {
    const pocket = {
      _id: this.pocketId,
      name: this.editPocketForm.value.name,
      currency: this.editPocketForm.value.currency,
      wallet: this.editPocketForm.value.wallet,
      creationDate: new Date(),
      lastModified: new Date()
    }

    return this._pocketService.edit(pocket).subscribe(
      response => response
    )


  }

  logic_deletePocket() {
    this._pocketService.logic_delete(this.id).subscribe(
      response => {
        console.log('delete pocket response: ', response)
        console.log("pocket deleted")
      }
    )
  }


}
