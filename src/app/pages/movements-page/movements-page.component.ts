

import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { MovementService } from '../../core/services/movement.service';
import { Movement } from '../../core/interfaces/movement';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-movements-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './movements-page.component.html',
  styleUrl: './movements-page.component.css'
})
export class MovementsPageComponent implements OnChanges, OnInit {
  movements: any[] = [];
  dataSource: any;
  users: any[] = [];
  categories: any[] = [];
  vendors: any[] = [];
  wallets: any[] = [];
  movementsType: any[] = [];
  movementsData: any[] = [];
  years: any[] = []
  months: any[] = []
 

  // Objeto que almacenará los filtros aplicados
  filterValues: any = {
    user: '',
    type: '',
    category: '',
    vendor: '',
    date: '',
    year: '',
    month: '',
    wallet: ''
  };
  constructor(
    private _movementsService: MovementService,
    public dialog: MatDialog,
    
   
  ) { }
  ngOnInit(): void {
    this.getMovements()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getMovements()
  }
  getMovements() {
    this._movementsService.getAll().subscribe((response: any) => {
      this.movements = response.map((movement: any) => {
        const movementDate = new Date(movement.date); // Convertir la fecha a objeto Date
        return {
          ...movement,
          year: movementDate.getFullYear().toString(), // Extraer el año
          month: (movementDate.getMonth() + 1).toString().padStart(2, '0') // Extraer el mes (getMonth() devuelve 0-11, así que sumamos 1)
        };
      });
      this.dataSource = new MatTableDataSource(this.movements);

      // Configurar el predicate para múltiples filtros
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchFilter = JSON.parse(filter);

        const matchesUser = searchFilter.user ? data.user?.name?.toLowerCase().includes(searchFilter.user) : true;
        const matchesType = searchFilter.type ? data.type?.toLowerCase().includes(searchFilter.type) : true;
        const matchesCategory = searchFilter.category ? data.category?.name?.toLowerCase().includes(searchFilter.category) : true;
        const matchesVendor = searchFilter.vendor ? data.vendor?.name?.toLowerCase().includes(searchFilter.vendor) : true;
        const matchesDate = searchFilter.date ? data.date?.toLowerCase().includes(searchFilter.date) : true;
        const matchesWallet = searchFilter.wallet ? data.wallet?.name?.toLowerCase().includes(searchFilter.wallet) : true;
        const matchesYear = searchFilter.year ? data.year?.includes(searchFilter.year) : true;
        const matchesMonth = searchFilter.month ? data.month.includes(searchFilter.month) : true;

        return matchesUser && matchesType && matchesCategory && matchesVendor && matchesYear && matchesMonth && matchesDate && matchesWallet;
      };
      // Llenar los arrays de usuarios, categorías y otros para los filtros
      this.users = this.getUniqueValues('user');
      this.categories = this.getUniqueValues('category');
      this.vendors = this.getUniqueValues('vendor');
      this.wallets = this.getUniqueValues('wallet');
      this.movementsType = this.getUniqueValues('type');
      this.movementsData = this.getUniqueValues('date');
      this.years = this.getUniqueValues('year');
      this.months = this.getUniqueValues('month');
    });
  }
  //To obtain unique values for user, category, vendor and wallet filters
  getUniqueValues(field: keyof Movement): any[] {
    const uniqueValues = this.movements
      .map((movement: Movement) => movement[field])  // Acceder a la propiedad usando el campo
      .filter((value: any) => value?.name || value)  // Filtrar valores no válidos
      .reduce((acc: any[], value: any) => {
        const name = value?.name || value;  // Algunos valores pueden no tener `name`
        if (!acc.some((v: any) => (v.name || v) === name)) {
          acc.push(value);
        }
        return acc;
      }, []);

    // Añadir una opción 'Todos' al principio del array

    if (typeof uniqueValues[0] === 'object' && uniqueValues[0]?.name) {
      return [{ name: 'all' }, ...uniqueValues];  // Para objetos con `name`
    } else {
      return ['all', ...uniqueValues];  // Para strings como `date` o `type`
    }
  }

  async openDeleteAllMovementsDialog() {
    try {
      const { DeleteAllMovementsDialogComponent } = await import('../../share/dialogs/delete-all-movements-dialog/delete-all-movements-dialog.component');
      {
        const dialogRef = this.dialog.open(DeleteAllMovementsDialogComponent, {})
        this.dataSource
        dialogRef.afterClosed().subscribe((response) => {
          if(response){
            this.getMovements()
          }
                    
        });
      }
    } catch (error) {
      console.log('error loading dialog component')
    }

  }

  displayedColumns: string[] = ['user', 'type', 'category', 'vendor', 'currency', 'amount', 'year', 'month', /*'date',*/ 'fromPocket', 'toPocket', 'pocket', 'wallet', 'notes'];

  // general filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValues = { ...this.filterValues, global: filterValue };
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  //user filter
  applyUserFilter(user: any) {
    if (user?.name === 'all') {
      this.filterValues.user = '';  // Reset user filter
    } else {
      this.filterValues.user = user?.name?.toLowerCase() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);  // Refreshing global filter
  }
  //movement type filter
  applyMovementTypeFilter(movementType: any) {
    if (movementType === 'all') {
      this.filterValues.type = '';
    } else {
      this.filterValues.type = movementType?.toLowerCase() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  // category filter
  applyCategoryFilter(category: any) {
    if (category?.name === 'all') {
      this.filterValues.category = ''; // Muestra todos los movimientos (resetea solo el filtro de categoría)
    } else {
      this.filterValues.category = category?.name?.toLowerCase() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues)
  }
  // vendor filter 
  applyVendorFilter(vendor: any) {
    if (vendor?.name === 'all') {
      this.filterValues.vendor = '';
    } else {
      this.filterValues.vendor = vendor?.name?.toLowerCase() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  // date filter
  applyMovementDateFilter(date: any) {
    if (date === 'all') {
      this.filterValues.date = '';
    } else {
      this.filterValues.date = date?.toLowerCase() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  // wallet filter
  applyWalletFilter(wallet: any) {
    if (wallet?.name === 'all') {
      this.filterValues.wallet = '';
    } else {
      this.filterValues.wallet = wallet?.name?.toLowerCase() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  applyYearFilter(year: any) {
    if (year === 'all') {
      this.filterValues.year = '';
    } else {
      this.filterValues.year = year?.toString() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  applyMonthFilter(month: any) {
    if (month === 'all') {
      this.filterValues.month = '';
    } else {
      this.filterValues.month = month?.toString() || '';
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  resetAllFilters() {
    this.dataSource.filter = '';
  }

  generatePdfFromFrontend() {
    console.log('Iniciando generatePdfFromFrontend...');
    try {
      // Configurar el PDF en apaisado (horizontal) con tamaño A4
      const doc = new jsPDF({
        orientation: 'landscape', // Para que sea apaisado
        unit: 'mm',               // Unidad de medida en milímetros
        format: 'a4'              // Tamaño A4
      });
      console.log('Instancia de jsPDF creada:', doc);

      // *** Verificación Clave ***
      console.log('Tipo de doc.autoTable:', typeof (doc as any).autoTable);
      // **

      // Captura los encabezados de la tabla
      const tableHeaders = this.displayedColumns.map(col => {
        switch (col) {
          case 'user': return 'User';
          case 'type': return 'Type';
          case 'category': return 'Category';
          case 'vendor': return 'Vendor';
          case 'currency': return 'Currency';
          case 'amount': return 'Amount';
          case 'year': return 'Year';
          case 'month': return 'Month';
          case 'fromPocket': return 'From Pocket';
          case 'toPocket': return 'To Pocket';
          case 'pocket': return 'Pocket';
          case 'wallet': return 'Wallet';
          case 'notes': return 'Notes';
          default: return col;
        }
      });

      // Captura los datos de la tabla
      const tableData = this.dataSource.filteredData.map((movement: any) => {
        return this.displayedColumns.map(column => {
          switch (column) {
            case 'user': return movement.user?.name || '-';
            case 'type': return movement.type || '-';
            case 'category': return movement.category?.name || '-';
            case 'vendor': return movement.vendor?.name || '-';
            case 'currency': return movement.currency || '-';
            case 'amount': return movement.amount || '-';
            case 'year': return movement.year || '-';
            case 'month': return movement.month || '-';
            case 'fromPocket': return movement.fromPocket?.name || '-';
            case 'toPocket': return movement.toPocket?.name || '-';
            case 'pocket': return movement.pocket?.name || '-';
            case 'wallet': return movement.wallet?.name || '-';
            case 'notes': return movement.notes || '-';
            default: return '-';
          }
        });
      });
      console.log('Llamando a doc.autoTable...');
      // Usa jsPDF autoTable para renderizar la tabla
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 10, // Empieza un poco más abajo para evitar el título
      });
      console.log('doc.autoTable llamado (aparentemente) sin error inmediato.');
      // Guarda el PDF
      doc.save('movements_table.pdf');
      console.log('PDF guardado.');
    } catch (error) {
      console.error("Error detallado dentro de generatePdfFromFrontend:", error);
    }

  }

  generatePdfFromBackend() {

    const filters = { ...this.filterValues }

    console.log('FILTERS: ', filters)
    this._movementsService.getPdfMovementsTableWithFilters(filters).pipe(
      tap((blob: Blob) => {
        // Descargar el PDF generado
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'movements_filtered.pdf';
        a.click();
        window.URL.revokeObjectURL(url); // Limpiar URL después de descargar
      }),
      catchError(error => {
        console.error('Error al generar el PDF', error);
        return of(null);  // Manejo de errores
      })
    ).subscribe();
  }

}












