import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, reduce, switchMap, tap, throwError, defaultIfEmpty, of, combineLatest, concatMap, forkJoin } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { PocketService } from './pocket.service';
import { Wallet } from '../interfaces/wallet';
import { Pocket } from '../interfaces/pocket';
import { MovementService } from './movement.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  userId!: string
  constructor(private http: HttpClient,
    private _authService: AuthenticationService,
    private _pocketService: PocketService,
    private _movementService: MovementService) {

    this._authService.getUserId().subscribe(response => this.userId = response)

  }

  url = "https://losportafoglio.onrender.com/wallets/"

  // returns all not deleted wallets of the user
  getAll(): Observable<Wallet[]> {
    return this._authService.getUserId().pipe(
      tap(userId => console.log('UserId: ', userId)),  // checking if userId is correct
      switchMap(userId => {
        return this.http.get<Wallet[]>(this.url + 'notDeleted/' + userId).pipe(
          tap((wallets) => console.log('all not deleted wallets of the user: ', wallets)),
          defaultIfEmpty([]), // return an empty array if there is not any wallet
          catchError((error) => {
            console.error('Error fetching wallets:', error);
            return of([]); //return an empty array if an error exists
          })
        );
      })
    );
  }
  // get not eliminated pockets of the wallet
  getPocketsOfWallet(id: string | any): Observable<any> {
    return this.http.get(this.url + 'pockets/' + id).pipe(
      tap((pocketsOfWallet) => { console.log('not eliminated pockets of the wallet: ', pocketsOfWallet) }),
      defaultIfEmpty([]),
      catchError(error => error),
      finalize(() => console.log("getPocketsOfWallet subscription ended")),
    )
  }
  //get wallet by id
  getById(id: string): any {
    return this.http.get(this.url + id)
  }
  //edit wallet
  edit(wallet: any) {
    const id = wallet._id
    const url = this.url + id
    const updateWallet = this.http.put(url, wallet)
    const getPocketsOfWallet = this.getPocketsOfWallet(id)

    return combineLatest([updateWallet, getPocketsOfWallet]).pipe(
      switchMap(([modifiedWallet, pockets]) => {
        const newMainPocket = {
          "_id": pockets[0]._id,
          "name": `Main pocket of: ` + wallet.name
        }
        return this._pocketService.edit(newMainPocket).pipe(
          map(() => modifiedWallet), // Return the modified wallet after editing the main pocket
        );
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error); // rethrow the error for further handling
      }),
      finalize(() => {
        console.log('edit wallet subscription ended');
      })
    );
  }
  //logic delete wallet
  logic_delete(id: any): any {
    const pocketsOfWallet$ = this.getPocketsOfWallet(id);

    return pocketsOfWallet$.pipe(
      tap(pockets => console.log('pockets of wallet to delete: ', pockets)),
      concatMap(pockets => {
        // Create an array of delete requests for each pocket
        const deletePocketRequests = pockets.map((pocket: Pocket) =>
          this._pocketService.logic_delete(pocket._id)
        );
        // Wait for all pocket deletions to complete
        return forkJoin(deletePocketRequests).pipe(
          concatMap(() => {
            // Pockets deleted, now delete the wallet
            const url = `${this.url}/${id}`; // Use template string for URL
            return this.http.patch(url, {});
          })
        );
      })
    );
  }
  // creating a new wallet with a first default pocket called "main pocket of (newWallet.name)"
  create(wallet: any): Observable<any> {
    //catching the userId
    return this._authService.getUserId().pipe(
      tap((userId: any) => {
        console.log('getting user from the wallet service: ', userId);
      }),
      //making and saving the new wallet object adding the userId to the received wallet
      concatMap((userId) => {
        const newWallet = { ...wallet, users: [userId] };
        const savedWallet = this.http.post(this.url, newWallet);
        return savedWallet
      }),
      //creating the first pocket by default
      concatMap((savedWallet: any) => {
        const pocket = {
          name: "main pocket of: " + savedWallet.name,
          amount: 0,
          currency: "euro",
          wallet: savedWallet._id
        };
        return this._pocketService.create(pocket);
      }),
      catchError((error) => {
        if (error.error.message.includes('E11000')) {
          alert("That name is already in use, the new wallets name must be a different one" + "( " + error.error.message + " )");
          return error;
        } else {
          alert('error creating a new wallet: ' + error.error.message);
          return error;
        }
      }),
      finalize(() => console.log("add new wallet and main pocket subscription ended"))
    );
  }


}



