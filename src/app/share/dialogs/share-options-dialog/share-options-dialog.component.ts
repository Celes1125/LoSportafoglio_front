import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { catchError, concatMap, tap, throwError } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user';


@Component({
  selector: 'app-share-options-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './share-options-dialog.component.html',
  styleUrl: './share-options-dialog.component.css'
})
export class ShareOptionsDialogComponent {
  userEmail: string = '';
  wallet: any;
  walletId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(WalletService) private _walletService: WalletService,
    @Inject(UserService) private _userService: UserService
  ) {
    this.wallet = this.data.wallet
    this.walletId = this.data.walletId
  }

  addNewUserToWallet() {
    const email = this.userEmail;
  
    return this._userService.getUserByEmail(email).pipe(
      tap((user: any) => console.log('NEW USER: ', user)),
      concatMap((user: any) => {
        return this._walletService.getById(this.wallet._id).pipe(
          tap((currentWallet: any) => console.log('CURRENT WALLET: ', currentWallet)),
          concatMap((currentWallet: any) => {
            const newWallet = { ...currentWallet, users: [...currentWallet.users, user._id] };
            console.log('NEW WALLET: ', newWallet);
            return this._walletService.edit(newWallet);
          })
        );
      }),
      catchError((error) => {
        console.error('Error adding new user to wallet: ', error);
        return throwError(() => error);
      })
    ).subscribe(response => {
      console.log('UPDATED WALLET', response);
    });
  }

  removeUserFromWallet(){
    const email = this.userEmail;

    return this._userService.getUserByEmail(email).pipe(
      tap((user:any) => console.log('USER TO REMOVE FROM WALLETS USERS ARRAY: ', user) ),
      concatMap( (user:any) => {
        return this._walletService.getById(this.wallet._id).pipe(
          tap( (currentWallet:any) => console.log('CURRENT WALLET: ', currentWallet)),
          concatMap( (currentWallet:any) => {
            const users : User[]= currentWallet.users.filter((u: any) => u._id !== user._id);
            console.log('FILTERED USERS: ', users)
            const newWallet = {...currentWallet, users: users }
            console.log('NEW WALLET: ', newWallet);
            return this._walletService.edit(newWallet);
          })
        )
      }),
      catchError((error) => {
        console.error('Error adding new user to wallet: ', error);
        return throwError(() => error);
      })
    ).subscribe(response => {
      console.log('UPDATED WALLET', response);
    });    

  }
  

}
