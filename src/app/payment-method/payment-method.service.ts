import { BehaviorSubject, Subject, catchError, map, tap, throwError } from "rxjs";
import { PaymentMethod } from "./payment-method.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { Injectable, OnInit } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
    private paymentMethods: PaymentMethod[] = [];
    paymentMethodsChanged = new BehaviorSubject<PaymentMethod[]>(this.paymentMethods);

    constructor(private http: HttpClient) { }

    fetchPaymentMethods() {
        this._fetchPaymentMethods();

        return this.paymentMethods.slice();
    }

    postPaymentMethod(paymentMethod: PaymentMethod) {
        const exists = this.paymentMethods.find(find => (find.description.toUpperCase() === paymentMethod.description.toUpperCase()));

        if (exists) {
            console.log('Payment method already exists!');

            return;
        }

        this._postPaymentMethod(paymentMethod);
    }

    deletePaymentMethod(id: string) {
        const exists = this.paymentMethods.find(find => (find.id === id));

        if (!exists) {
            console.log('Unable to delete payment method because it was not found!');

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
                    console.log('Error fetching payment methods: ', error);

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
                    console.log('Error posting payment method: ', error);

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(response => {
                this._fetchPaymentMethods();
            });
    }

    private _deletePaymentMethod(id: string) {
        this.http
            .delete<PaymentMethod>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}/${id}.json`
            )
            .pipe(
                catchError(error => {
                    console.log('Error deleting payment method: ', error);

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(() => {
                this._fetchPaymentMethods();
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
                    console.log('Error updating payment method: ', error);

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(() => {
                this._fetchPaymentMethods();
            });
    }
}