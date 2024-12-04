import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-share-wallet-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './share-wallet-dialog.component.html',
  styleUrl: './share-wallet-dialog.component.css'
})
export class ShareWalletDialogComponent {
  userEmail: string = '';
  wallet: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(NotificationService) private _notificationService: NotificationService,
  ) {
    this.wallet = this.data.wallet
  }

  sendInvitation() {
    this._notificationService.sendInvitation(this.wallet._id, this.userEmail).subscribe(
      (response: any) => response
    )
  }

}
