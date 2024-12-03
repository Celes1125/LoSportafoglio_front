import { Movement } from './../interfaces/movement';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, map, tap, switchMap, of, Observable, filter, forkJoin, throwError } from 'rxjs';
import { PocketService } from './pocket.service';
import { Pocket } from '../interfaces/pocket';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  income: any;
  userId!: string;
  url = "https://losportafoglio.onrender.com/movements/"

  constructor(private http: HttpClient,
    private _pocketService: PocketService,
    private _authService: AuthenticationService) {
    this.getUser()
  }

  // get user
  getUser() {
    this._authService.getUserId().subscribe(
      (response: string) => this.userId = response
    )
  }
  //get all movements of the user
  getAll(): Observable<any> {
    let movesUrl = this.url + 'userMovements/' + this.userId;
    console.log('MOVESURL: ', movesUrl)
    return this.http.get<Movement[]>(movesUrl).pipe(
      tap((filteredMovements: any) => console.log("filtered movements: ", filteredMovements)),
      // Catch and handle errors (optional: provide meaningful logging or UI feedback)
      catchError(error => error),
      // Finalize with a message (optional)
      finalize(() => console.log('get movements subscription ended'))
    );
  }
  //create movement
  create(movement: any): Observable<any> {
    const newMovement = { ...movement, user: this.userId }
    return this.http.post(this.url, newMovement).pipe(
      tap(response => response),
      catchError(error => error),
      finalize(() => {
        console.log('create movements subscription ended')
      })
    )
  }
  //add an income or a expense 
  addIncomeOrExpense(movement: any) {
    return this.create(movement).pipe(
      tap((createdMovement) => console.log('created movement: ', createdMovement)),
      switchMap(() => this._pocketService.getById(movement.pocket)),
      map((pocket: Pocket) => {
        const amount = pocket.amount;
        return amount
      }),
      catchError(error => {
        console.error('getting pocket error:', error);
        return of(null)
      }),
      map((amount: any) => {
        if (amount !== null && amount !== undefined) { // checking if amount is null or undefined
          const newAmount = (movement.type === 'in') ? amount + movement.amount : amount - movement.amount;
          return { amount, newAmount };
        } else {
          // Handle cases where amount is null (either throw an error or return a default value)
          return { amount: null, newAmount: null }; // null values return example
        }
      }),
      switchMap(({ newAmount }) => {
        return this._pocketService.edit({
          _id: movement.pocket,
          amount: newAmount,
          lastModified: new Date()
        });
      }),
      catchError(error => error)
    )

  }
  //delete movements by pocket
  deleteMovementsByPocket(id: string) {
    const url = this.url + "byPocketId/" + id
    return this.http.delete(url).pipe(
      tap(response => response),
      catchError(error => error),
      finalize(() => console.log('delete movements by pocket subscription ended'))
    )
  }
  //delete movements by user
  deleteMovementsByUser() {
    let id = this.userId
    const url = this.url + "byUserId/" + id
    return this.http.delete(url).pipe(
      tap(response => response),
      catchError(error => error),
      finalize(() => console.log('delete movements by user subscription ended'))

    )
  }
  //edit movement
  edit(movement: any): Observable<any> {
    const url = this.url + movement._id
    return this.http.put<any>(url, movement)
  }
  //get movements of a wallet
  getMovementsOfWallet(walletId: any): Observable<any> {
    return this.http.get<Movement[]>(this.url).pipe(
      // Filter movements based on userId      
      filter((movements: Movement[]) => movements.some(movement => movement.wallet._id === walletId)),
      // Tap the filtered movements for logging
      tap((filteredMovements: any) => console.log("filtered movements of wallet: ", filteredMovements)),
      // Catch and handle errors (optional: provide meaningful logging or UI feedback)
      catchError(error => error),
      // Finalize with a message (optional)
      finalize(() => console.log('get movements of wallet subscription ended'))
    );
  }
  // get pdf of complete all movements table !!!WARNING!!! be carefull, could be a big request  
  getPdfMovementsTable(): Observable<Blob> {
    // get token (from local storage or an authentication service)    
    const token = localStorage.getItem('token');

    // set headers, including the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // header for the token, using bearer
      'Content-Type': 'application/json'   // content type header
    });

    return this.http.get(`${this.url}getTable/${this.userId}`, {
      headers: headers,                    // including headers
      responseType: 'blob'                 // The answer will be a blob (PDF)
    }).pipe(
      catchError(error => {
        console.error('PDF request error', error);
        return of(error);  // handling error
      })
    );
  }
  // get pdf of filtered movements table !!!WARNING!!! be carefull, also could be a big request 
  getPdfMovementsTableWithFilters(filters: any): Observable<Blob> {
    // get token (from local storage or an authentication service) 
    const token = localStorage.getItem('token');
    // set headers, including the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // header for the token, using bearer
      'Content-Type': 'application/json'   // content type header
    });
    return this.http.post(`${this.url}getTable/${this.userId}`, filters, {
      headers: headers,                    // including headers
      responseType: 'blob'                  // The answer will be a blob (PDF)
    }).pipe(
      catchError(error => {
        console.error('Error en la solicitud del PDF', error);
        return of(error);  // handling error
      })
    );
  }

}
