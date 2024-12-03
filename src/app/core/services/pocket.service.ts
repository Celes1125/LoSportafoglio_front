import { Observable, catchError, defaultIfEmpty, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pocket } from '../interfaces/pocket';
@Injectable({
  providedIn: 'root'
})
export class PocketService {
  url = "https://losportafoglio.onrender.com/pockets/"

  constructor(
    private http: HttpClient,    
  ) { }
  
  //logic delete pocket
  logic_delete(id: string) {
    const url = this.url + id
    return this.http.patch(url, {}).pipe(
      tap(() => console.log(url, id)),
      defaultIfEmpty([]),
      catchError(error => error),
      finalize(() => console.log("deletePocket subscription ended")),
    )

  }
  //edit pocket
  edit(pocket: any): Observable<any> {
    const url = this.url + pocket._id
    return this.http.put<any>(url, pocket)
  }
  //get pocket by id
  getById(id: string): Observable<any> {
    const url = this.url + id
    return this.http.get(url).pipe(
      tap(response => console.log("pocket response: ", response)),
      catchError(error => error),
      finalize(() => console.log("pocket subscription ended"))
    )
  }
  //create pocket
  create(pocket: any): Observable<any> {
    return this.http.post(this.url, pocket).pipe(
      tap(response => console.log("Create pocket response: ", response)),
      catchError((error) => {
        console.error("Error in create pocket:", error);
        return throwError(() => error);
      }),
      finalize(() => console.log("Create pocket subscription ended"))
    );
  }
  // fisic delete all pockets
  fisic_deleteAll() {
    return this.http.delete(this.url).pipe(
      tap(response => console.log(" delete all pockets response: ", response)),
      catchError(error => error),
      finalize(() => console.log("delete all pockets subscription ended")))
  }
  // refresh pockets of transfers !!!this method better in backend...
  refreshPocketsOfTransfers(transfer: any) {
    this.refreshFromPocket(transfer.fromPocket, transfer.amount).subscribe(
      response => response
    )
    this.refreshToPocket(transfer.toPocket, transfer.amount).subscribe(
      response => response
    )
  }
  // refresh fromPocket !!!this method better in backend...
  refreshFromPocket(pocketId: string, transferAmount: number) {
    return this.getById(pocketId).pipe(
      tap(pocket => console.log(pocket)),
      map((pocket: Pocket) => {
        return pocket.amount
      }),
      catchError(error => {
        console.error('getting pocket error:', error);
        return of(null)
      }),
      map((amount) => {
        if (amount != null) {
          const newAmount = amount - transferAmount
          return { newAmount }
        } else {
          return { amount: null }
        }
      }),
      tap(({ newAmount }) => console.log("newAmount: ", newAmount)),
      switchMap(({ newAmount }) => {
        return this.edit({
          _id: pocketId,
          amount: newAmount,
          lastModified: new Date()
        });
      }),
      catchError(error => {
        console.error('getting pocket error:', error);
        return of(null)
      }),
    )
  }
  // refresh toPocket !!!this method better in backend...
  refreshToPocket(pocketId: string, transferAmount: number) {
    return this.getById(pocketId).pipe(
      tap(pocket => console.log(pocket)),
      map((pocket: Pocket) => {
        return pocket.amount
      }),
      catchError(error => {
        console.error('getting pocket error:', error);
        return of(null)
      }),
      map((amount) => {
        if (amount != null) {
          const newAmount = amount + transferAmount
          return { newAmount }
        } else {
          return { amount: null }
        }
      }),
      tap(({ newAmount }) => console.log("newAmount: ", newAmount)),
      switchMap(({ newAmount }) => {
        return this.edit({
          _id: pocketId,
          amount: newAmount,
          lastModified: new Date()
        });
      }),
      catchError(error => {
        console.error('getting pocket error:', error);
        return of(null)
      }),
    )
  }

}











