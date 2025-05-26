import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  constructor(
    private router:Router
  ) {}
  logout() {
    localStorage.removeItem('token');
    alert('See you later!');
    this.router.navigateByUrl('/login');
  }
  

}