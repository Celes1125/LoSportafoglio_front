import { NotificationService } from '../../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../../interfaces/notification';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css'
})
export class NotificationsPageComponent implements OnInit {
  
  notifications: Notification[] = []
  constructor(
    private _notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getAllNotifications()

  }

  getAllNotifications() {
    return this._notificationService.getAllNotifications().subscribe((response:any) => {
      this.notifications = response
    });
  }

}




