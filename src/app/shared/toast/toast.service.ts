import { Injectable } from "@angular/core";
import { NotificationsService } from "angular2-notifications";

@Injectable({ providedIn: 'root' })
export class ToastService {

    constructor(private notificationService: NotificationsService) { }

    createSuccess(message) {
        this.notificationService.success(
            'Success',
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

    createError(message) {
        this.notificationService.error(
            'Error',
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

    createWarning(message) {
        this.notificationService.warn(
            'Warning',
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