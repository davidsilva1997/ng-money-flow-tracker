import { BehaviorSubject, Subject, catchError, map, tap, throwError } from "rxjs";
import { PaymentMethod } from "./payment-method.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Injectable } from "@angular/core";
import { ToastService } from "../../shared/toast/toast.service";

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
    private paymentMethods: PaymentMethod[] = [];
    paymentMethodsChanged = new BehaviorSubject<PaymentMethod[]>(this.paymentMethods);

    constructor(private http: HttpClient, private toastService: ToastService) { }

    fetchPaymentMethods() {
        this._fetchPaymentMethods();

        return this.paymentMethods.slice();
    }

    postPaymentMethod(paymentMethod: PaymentMethod) {
        const exists = this.paymentMethods.find(find => (find.description.toUpperCase() === paymentMethod.description.toUpperCase()));

        if (exists) {
            this.toastService.createWarning('Payment Method', 'Payment method already exists!');

            return;
        }

        this._postPaymentMethod(paymentMethod);
    }

    deletePaymentMethod(id: string) {
        const exists = this.paymentMethods.find(find => (find.id === id));

        if (!exists) {
            this.toastService.createError('Payment Method', 'Error deleting payment method.');

            return;
        }

        this._deletePaymentMethod(id);
    }

    putPaymentMethod(paymentMethod: PaymentMethod) {
        this._putPaymentMethod(paymentMethod);
    }

    private _fetchPaymentMethods() {
        this.http
            .get<PaymentMethod[]>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}.json`
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Payment Method', 'Error fetching payment methods.');

                    return throwError(() => {
                        new Error(error);
                    });
                }),
                map(response => {
                    return Object.keys(response).map(key => {
                        return { id: key, ...response[key] };
                    });
                }),
                tap(paymentMethods => {
                    this.paymentMethods = paymentMethods || [];
                    this.paymentMethodsChanged.next(this.paymentMethods.slice());
                })
            )
            .subscribe();
    }

    private _postPaymentMethod(paymentMethod: PaymentMethod) {
        this.http
            .post<PaymentMethod>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}.json`,
                paymentMethod
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Payment Method', 'Error adding new payment method.')

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(response => {
                this._fetchPaymentMethods();
                this.toastService.createSuccess('Payment Method', 'Payment method created.');
            });
    }

    private _deletePaymentMethod(id: string) {
        this.http
            .delete<PaymentMethod>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}/${id}.json`
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Payment Method', 'Error deleting payment method.');

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(() => {
                this._fetchPaymentMethods();
                this.toastService.createSuccess('Payment Method', 'Payment method deleted.');
            });
    }

    private _putPaymentMethod(paymentMethod: PaymentMethod) {
        this.http
            .put<PaymentMethod>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}/${paymentMethod.id}.json`,
                paymentMethod
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Payment Method', 'Error updating payment method.');

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(() => {
                this._fetchPaymentMethods();
                this.toastService.createSuccess('Payment Method', 'Payment method updated.');
            });
    }
}