import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/interfaces/category';;
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, FormsModule, MatDialogModule],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent implements OnInit {
  dataSource!: any;
  deleteFlag: boolean = true

  constructor(
    private _categoryService: CategoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories() {
    this._categoryService.getAll().subscribe(response => {
      this.dataSource = new MatTableDataSource(response)
    })
  }

  displayedColumns: string[] = ['name', 'edit', 'delete'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openCategoriesDialog(category?: Category, deleteFlag?: boolean) {
    try {
      const { CategoriesDialogComponent } = await import('../../share/dialogs/categories-dialog/categories-dialog.component')
      const dialogRef = this.dialog.open(CategoriesDialogComponent, {
        data: {
          category: category,
          deleteFlag: deleteFlag
        }
      });
      dialogRef.afterClosed().subscribe(
        (response) => {
          if (response) {
            this.getAllCategories()
            console.log('DATASOURCE: ', this.dataSource)
            console.log("categories changes saved ok: ", response)
            alert("categories changes saved ok: ")
          }
        }
      )
    } catch (error) {
      console.error("Error loading dialog component", error);
    }
  }
}
