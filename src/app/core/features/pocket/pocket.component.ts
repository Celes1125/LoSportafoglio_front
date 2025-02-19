import { Component, Input, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Pocket } from '../../interfaces/pocket';
import { PocketsDialogComponent } from '../../../share/dialogs/pockets-dialog/pockets-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pocket',
  imports: [RouterModule, MatDialogModule],
  templateUrl: './pocket.component.html',
  styleUrl: './pocket.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PocketComponent implements OnInit {
  @Input() pocket!: Pocket  
  deleteFlag: boolean = true
  router: Router = new Router;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.sliceNames();
  }

  sliceNames(this: any) {
    if (this.pocket.name.length > 20) {
      this.pocket.name = this.pocket.name.slice(0, 20) + '...'
    }

  }

  openPocketsDialog(pocketId?: string, deleteFlag?: boolean) {
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
}

  

}
