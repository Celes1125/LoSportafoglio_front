import { Component, ElementRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { MovementsPageComponent } from '../movements-page/movements-page.component';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css',
  imports: [MovementsPageComponent]
})
export class ReportsPageComponent implements OnInit {

  @ViewChild('movements') movementsElement!: ElementRef
  @ViewChild('graphics') graphicsElement!: ElementRef
  @ViewChild('archive') archiveElement!: ElementRef

  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
    // Escuchamos los clics en los botones
    this.renderer.listen(document.getElementById('movementsBtn'), 'click', () => {
      this.showSection('movements');
    });

    this.renderer.listen(document.getElementById('graphicsBtn'), 'click', () => {
      this.showSection('graphics');
    });

    this.renderer.listen(document.getElementById('archiveBtn'), 'click', () => {
      this.showSection('archive');
    });

  }

  showSection(section: string) {
    // Ocultamos todos los divs
    this.movementsElement.nativeElement.style.display = 'none';
    this.graphicsElement.nativeElement.style.display = 'none';
    this.archiveElement.nativeElement.style.display = 'none';

    // Mostramos solo el div correspondiente
    if (section === 'movements') {
      this.movementsElement.nativeElement.style.display = 'block';
    } else if (section === 'graphics') {
      this.graphicsElement.nativeElement.style.display = 'block';
    } else if (section === 'archive') {
      this.archiveElement.nativeElement.style.display = 'block';
    }
  }

}
