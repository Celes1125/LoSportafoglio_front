import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CalcService {
  private apiUrl: string = environment.apiUrl
  url = `${this.apiUrl}`
  
  constructor(
    private http: HttpClient,    
  ) { }

  getWalletAmounts(id:string) : Observable <any> {
    const walletId : string = id;
    return this.http.get(this.url + '/wallets/amounts/' + walletId)  
  }   

  refreshPockets(movement:any){
    return this.http.post(this.url + '/pockets/refresh', movement)
  }
 
  
}
