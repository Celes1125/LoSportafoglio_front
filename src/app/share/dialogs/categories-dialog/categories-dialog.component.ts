import { CategoryService } from '../../../core/services/category.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Category } from '../../../core/interfaces/category';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './categories-dialog.component.html',
  styleUrl: './categories-dialog.component.css'
})
export class CategoriesDialogComponent implements OnInit {
  category?: Category
  deleteFlag?: boolean | undefined
  form!: FormGroup
  editForm!: FormGroup
  categories: Category[] = []
  categories$: Observable<Category[]> = this._categoryService.getAll()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _categoryService: CategoryService,
    private _formBuilder: FormBuilder
  ) {
    this.category = this.data.category
    this.deleteFlag = this.data.deleteFlag
    this.form = this._formBuilder.group({
      name: ["", [Validators.required]],
      description: ""
    });

    if (this.category !== undefined) {
      this.editForm = this._formBuilder.group({
        editname: this.category.name,
        editdescription: this.category.description
      })
    }

  }

  ngOnInit(): void {
    this.categories$.subscribe((response) => {
      this.categories = response
      console.log('categories on dialog: ', this.categories)
    })
  }

  createNewCategory() {
    const newCategory = {
      name: this.form.value.name,
      description: this.form.value.description
    }
    return this._categoryService.create(newCategory).subscribe({
      next: (response: any) => {
        console.log("cateogory created successfully:", response);
        alert("Category created successfully!");
      },
      error: (error: { status: number; error: { message: string; }; }) => {
        if (error.status === 400) {
          // Maneja el error 400 específico
          alert("Error: " + error.error.message); // Muestra el mensaje de error recibido desde el backend
        } else {
          // Maneja otros posibles errores
          console.error("Unexpected error:", error);
          alert("An unexpected error occurred.");
        }
      },

    });

  }

  editCategory() {
    if (this.category !== undefined) {
      const category = {
        _id: this.category._id,
        name: this.editForm.value.editname,
        description: this.editForm.value.editdescription
      }
      this._categoryService.edit(category).subscribe(
        (response: any) => response
      )
    } else {
      return alert("you can't edit the category")
    }

  }

  deleteCategory() {
    if (this.category !== undefined) {
      this._categoryService.delete(this.category._id).subscribe(
        (response: any) => response
      )
    }

  }

}


