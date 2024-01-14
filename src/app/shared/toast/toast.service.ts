import { Injectable } from "@angular/core";
import { NotificationsService } from "angular2-notifications";

@Injectable({ providedIn: 'root' })
export class ToastService {

    constructor(private notificationService: NotificationsService) { }

    createSuccess(title, message) {
        this.notificationService.success(
            title,
            message,
            {
                position: ['bottom', 'right'],
                timeOut: 2000,
                showProgressBar: true,
                pauseOnHover: true,
                animate: 'fromRight'
            }
        );
    }

    createError(title, message) {
        this.notificationService.error(
            title,
            message,
            {
                position: ['bottom', 'right'],
                timeOut: 2000,
                showProgressBar: true,
                pauseOnHover: true,
                animate: 'fromRight'
            }
        );
    }

    createWarning(title, message) {
        this.notificationService.warn(
            title,
            message,
            {
                position: ['bottom', 'right'],
                timeOut: 2000,
                showProgressBar: true,
                pauseOnHover: true,
                animate: 'fromRight'
            }
        );
    }
}