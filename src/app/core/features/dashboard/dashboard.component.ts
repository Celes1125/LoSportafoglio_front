
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [RouterOutlet, CommonModule, MainMenuComponent]
})

export class DashboardComponent {  


}