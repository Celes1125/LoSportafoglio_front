import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LoSportafoglio_front';
  developedBy = 'Maria Celeste Colautti, with a little tiny help from chatGPT jajja :P'
  dateOfDevelopment = '2023-2024'
  backendDeployOn = "Render"
  backendUrl = 'https://losportafoglio.onrender.com'
  frontEndDeployOn = "Vercel"
  dataBaseDeploy = "Mongo DB Atlas"
}
