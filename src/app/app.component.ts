import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LoSportafoglio_front';
  developedBy = 'Maria Celeste Colautti, with a little tiny help from chatGPT, Gemini, DeepSeek, etc jajja :P'
  dateOfDevelopment = '2023-'
  backendDeployOn = "Render"
  backendUrl = 'https://losportafoglio.onrender.com'
  frontEndDeployOn = "Vercel"
  dataBaseDeploy = "Mongo DB Atlas"
}