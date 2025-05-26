import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-reports-page',
  standalone: true,
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css',
  imports: [CommonModule, RouterLink, RouterOutlet]
})
export class ReportsPageComponent {
  constructor() { }
}
