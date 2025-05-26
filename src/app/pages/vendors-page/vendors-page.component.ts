import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../core/services/vendor.service';
import { Vendor } from '../../core/interfaces/vendor';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-vendors-page',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTableModule, FormsModule],
  templateUrl: './vendors-page.component.html',
  styleUrl: './vendors-page.component.css'
})

export class VendorsPageComponent implements OnInit {
  dataSource!: any  
  deleteFlag: boolean = true  
  
  constructor(
    private vendorService: VendorService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllVendors();
  }

  getAllVendors() {
    this.vendorService.getAll().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);      
        
      })
  }
  displayedColumns: string[] = ['name', 'edit', 'delete'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openVendorsDialog(vendor?: Vendor, deleteFlag?: boolean) {
    try{
      const { VendorsDialogComponent } = await import ('../../share/dialogs/vendors-dialog/vendors-dialog.component');
      const dialogRef = this.dialog.open(VendorsDialogComponent, {
        data: {
          vendor: vendor,
          deleteFlag: deleteFlag                   
        }
      });
      dialogRef.afterClosed().subscribe(
        response => {
          if (response) {
            this.getAllVendors()
            console.log('DATASOURCE: ',this.dataSource) 
            console.log("vendors changes saved ok: ", response)
            alert("vendors changes saved ok")            
          }
        })
    }catch(error){
      console.log('error loading dialog component', error)
    };     
  }
}
