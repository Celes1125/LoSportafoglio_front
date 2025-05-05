import { CategoryService } from '../../../core/services/category.service';
import { Router, RouterModule } from '@angular/router';
import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/interfaces/category';
import { VendorService } from '../../../core/services/vendor.service';
import { Vendor } from '../../../core/interfaces/vendor';
import { WalletService } from '../../../core/services/wallet.service';
import { Pocket } from '../../../core/interfaces/pocket';
import { MovementService } from '../../../core/services/movement.service';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CalcService } from '../../../core/services/calc.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-add-movement',
  standalone: true,
  imports: [MatDatepickerModule, CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatFormFieldModule,
  MatStepperModule, MatButtonModule, MatInputModule, RouterModule],
  templateUrl: './movements-dialog.component.html',
  styleUrl: './movements-dialog.component.css'
})

export class MovementsDialogComponent implements OnChanges {

  wallet!: any
  walletId!: any
  incomeForm!: FormGroup
  expenseForm!: FormGroup
  transferForm!: FormGroup
  categories: Category[] = []
  vendors: Vendor[] = []
  pockets: Pocket[] = []
  pocketId: any;
  amountToAdd: any;
  firstAmount: any;
  router: Router = new Router;
  movement_type: string;
  

  constructor(
    private _formBuilder: FormBuilder,
    private _categoriesService: CategoryService,
    private _vendorsService: VendorService,
    private _walletService: WalletService,
    private _movementsService: MovementService,
    private _calcService: CalcService,
    @Inject(MAT_DIALOG_DATA) public data: any    
  ) {

    this.wallet = this.data.wallet
    this.walletId = this.data.walletId
    this.movement_type = this.data.movement_type
    
    this.getCategories();
    this.getVendors();
    this.getPockets();
    
    this.incomeForm = this._formBuilder.group({
      category: ["", [Validators.required]],
      vendor: ["", [Validators.required]],
      pocket: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      notes: ["", [Validators.required]],
      date: [this.getTodaysDateInputFormat()]
      
    });

    this.expenseForm = this._formBuilder.group({
      category: ["", [Validators.required]],
      vendor: ["", [Validators.required]],
      pocket: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      notes: ["", [Validators.required]],
      date: [this.getTodaysDateInputFormat()]
    });

    this.transferForm = this._formBuilder.group({
      fromPocket: ["", [Validators.required]],
      toPocket: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      notes: ["", [Validators.required]],
      date: [this.getTodaysDateInputFormat()]
    })


  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getPockets()
  }

  // Obtiene la fecha actual en formato yyyy-MM-dd para el input
  //gettin todays date in the yyyy-MM-dd format for the input
  getTodaysDateInputFormat(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Devuelve la fecha seleccionada como objeto Date
  // returns the seleted date like a Date type object
  getSelectedDate(): Date {   
    return new Date(this.incomeForm.value.date);
  }


  getCategories() {
    this._categoriesService.getAll().subscribe(
      (response: Category[]) => {
        if (response) {
          this.categories = response
        }
      }
    )
  }

  getVendors() {
    this._vendorsService.getAll().subscribe(
      (response: any) => {
        if (response) {
          this.vendors = response
        } else {
          null
        }
      }
    )
  }

  getPockets() {
    this._walletService.getPocketsOfWallet(this.walletId).subscribe(
      response => {
        this.pockets = response

      }
    )
  }

  addMovement() {
    let movement;

    switch (this.movement_type) {
      case 'income':
        movement = {
          type: "in",
          category: this.incomeForm.value.category,
          vendor: this.incomeForm.value.vendor,
          pocket: this.incomeForm.value.pocket,
          currency: 'euro',
          amount: this.incomeForm.value.amount,
          notes: this.incomeForm.value.notes,
          fromPocket: null,
          toPocket: null,
          wallet: this.wallet._id,
          date:this.incomeForm.value.date
          
        };
        console.log("INCOME MOVEMENT: ", movement);
        this._movementsService.create(movement).subscribe(response => response)
        this._calcService.refreshPockets(movement).subscribe(response => response)
        break;

      case 'expense':
        movement = {
          type: "out",
          category: this.expenseForm.value.category,
          vendor: this.expenseForm.value.vendor,
          pocket: this.expenseForm.value.pocket,
          currency: 'euro',
          amount: this.expenseForm.value.amount,
          notes: this.expenseForm.value.notes,
          fromPocket: null,
          toPocket: null,
          wallet: this.wallet._id,
          
        };
        console.log("EXPENSE MOVEMENT: ", movement);
        this._movementsService.create(movement).subscribe(response => response)
        this._calcService.refreshPockets(movement).subscribe(response => response)
        break;

      case 'transfer':
        movement = {
          type: "transfer",
          category: null,
          vendor: null,
          pocket: null,
          currency: 'euro',
          amount: this.transferForm.value.amount,
          notes: this.transferForm.value.notes,
          fromPocket: this.transferForm.value.fromPocket,
          toPocket: this.transferForm.value.toPocket,
          wallet: this.wallet._id
        };
        console.log("TRANSFER MOVEMENT: ", movement);

        this._movementsService.create(movement).subscribe(response => response)
        this._calcService.refreshPockets(movement).subscribe(response => response)
        break;

      default:
        console.error("Invalid movement type.");
        break;
    }
  }
  
}











