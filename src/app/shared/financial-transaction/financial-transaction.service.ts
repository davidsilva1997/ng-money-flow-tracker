import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subject, Subscription, catchError, forkJoin, map, switchMap, tap, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { FinancialTransaction } from "./financial-transaction-modal/financial-transaction.model";
import { ToastService } from "../toast/toast.service";
import { environment } from "../../../environments/environment.development";
import { CategoryService } from "../../settings/category/category.service";
import { Category } from "../../settings/category/category.model";
import { PaymentMethodService } from "../../settings/payment-method/payment-method.service";
import { PaymentMethod } from "../../settings/payment-method/payment-method.model";

@Injectable({ providedIn: 'root' })
export class FinancialTransactionService {
    financialTransactionsChangedSubject = new Subject<void>();

    constructor(private http: HttpClient, private categoryService: CategoryService, private paymentMethodService: PaymentMethodService) { }

    fetch() {
        return forkJoin({
            categories: this.categoryService.fetch(),
            paymentMethods: this.paymentMethodService.fetch(),
            financialTransactions: this.http
                .get<FinancialTransaction[]>(
                    `${environment.firebaseAPI}${environment.firebaseFinancialTransactions}.json`
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
                )
        });
    }

    post(financialTransaction: FinancialTransaction) {
        return this.http
            .post<FinancialTransaction>(
                `${environment.firebaseAPI}${environment.firebaseFinancialTransactions}.json`,
                financialTransaction
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
    }

    put(financialTransaction: FinancialTransaction) {
        return this.http
            .put<FinancialTransaction>(
                `${environment.firebaseAPI}${environment.firebaseFinancialTransactions}/${financialTransaction.id}.json`,
                financialTransaction
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
            .delete<FinancialTransaction>(
                `${environment.firebaseAPI}${environment.firebaseFinancialTransactions}/${id}.json`
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