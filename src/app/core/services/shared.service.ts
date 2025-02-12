import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Wallet } from '../interfaces/wallet';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedValueSubject = new BehaviorSubject<Wallet | null>(null);
  selectedValue$ = this.selectedValueSubject.asObservable();

  setSelectedValue(value: Wallet | null) {
    this.selectedValueSubject.next(value);
  }
}
