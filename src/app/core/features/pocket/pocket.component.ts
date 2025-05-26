import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Pocket } from '../../interfaces/pocket';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-pocket',
  imports: [MatDialogModule],
  templateUrl: './pocket.component.html',
  styleUrl: './pocket.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PocketComponent implements OnInit {
  @Input() pocket!: Pocket
  deleteFlag: boolean = true


  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sliceNames();
  }

  sliceNames(this: any) {
    if (this.pocket.name.length > 20) {
      this.pocket.name = this.pocket.name.slice(0, 20) + '...'
    }

  }

  async openPocketsDialog(pocketId?: string, deleteFlag?: boolean) {
    try {
      const { PocketsDialogComponent } = await import('../../../share/dialogs/pockets-dialog/pockets-dialog.component');
      const dialogRef = this.dialog.open(PocketsDialogComponent, {
        data: {
          wallet: this.pocket.wallet,
          pocketId: pocketId,
          deleteFlag: deleteFlag
        }
      });
      dialogRef.afterClosed().subscribe(
        response => {
          if (response) {
            this.router.navigateByUrl('/dashboard');
          }
        });
    } catch (error) {
      console.error("Error loading dialog component", error);
    }

  }
}
