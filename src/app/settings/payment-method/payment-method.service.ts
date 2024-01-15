import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, catchError, map, throwError } from "rxjs";

import { PaymentMethod } from "./payment-method.model";
import { environment } from "../../../environments/environment.development";

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
    paymentMethodsChangedSubject = new Subject<void>();

    constructor(private http: HttpClient) { }

    fetch() {
        return this.http
            .get<PaymentMethod[]>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}.json`
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                }),
                map(response => {
                    if (!response) {
                        return [];
                    }

                    return Object.keys(response).map(key => {
                        return { id: key, ...response[key] };
                    });
                })
            );
    }

    post(paymentMethod: PaymentMethod) {
        return this.http
            .post<PaymentMethod>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}.json`,
                paymentMethod
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
    }

    put(paymentMethod: PaymentMethod) {
        return this.http
            .put<PaymentMethod>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}/${paymentMethod.id}.json`,
                paymentMethod
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
    }

    delete(id: string) {
        return this.http
            .delete<PaymentMethod>(
                `${environment.firebaseAPI}${environment.firebasePaymentMethods}/${id}.json`
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
    }
}