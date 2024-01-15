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

    constructor(private http: HttpClient) { }

    fetch() {
        return this.http
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
            );
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
// export class FinancialTransactionService implements OnDestroy {
//     private financialTransactions: FinancialTransaction[] = [];
//     financialTransactionChanged = new BehaviorSubject<FinancialTransaction[]>(this.financialTransactions);
//     categories: Category[];
//     paymentMethods: PaymentMethod[];
//     private categoriesSubscription: Subscription;
//     private paymentMethodsSubscription: Subscription;

//     constructor(private http: HttpClient, private toastService: ToastService, private categoryService: CategoryService, private paymentMethodService: PaymentMethodService) { }

//     ngOnDestroy(): void {
//         this.categoriesSubscription.unsubscribe();
//         this.paymentMethodsSubscription.unsubscribe();
//     }

//     fetch() {
//         this._fetch();
//     }

//     post(financialTransaction: FinancialTransaction) {
//         this._post(financialTransaction);
//     }

//     delete(id: string) {
//         const exists = this.financialTransactions.find(find => (find.id === id));

//         if (!exists) {
//             this.toastService.createError('Financial Transaction', 'Error deleting financial transaction.');

//             return;
//         }

//         this._delete(id);
//     }

//     private _fetch() {
//         // this.categoriesSubscription = this.categoryService.categoriesChanged.subscribe((categories: Category[]) => {
//         //     this.categories = categories;
//         // });

//         // this.paymentMethodsSubscription = this.paymentMethodService.paymentMethodsChanged.subscribe((paymentMethods: PaymentMethod[]) => {
//         //     this.paymentMethods = paymentMethods;
//         // });

//         this.categoryService.fetch();
//         this.paymentMethodService.fetch();

//         this.http
//             .get<FinancialTransaction[]>(
//                 `${environment.firebaseAPI}${environment.firebaseFinancialTransactions}.json`
//             )
//             .pipe(
//                 catchError(error => {
//                     this.toastService.createError('Financial Transaction', 'Error fetching financial transactions');

//                     return throwError(() => {
//                         new Error(error);
//                     });
//                 }),
//                 map(financialTransactions => {
//                     if (!financialTransactions) {
//                         return [];
//                     }

//                     return Object.keys(financialTransactions).map(key => {
//                         const financialTransaction = { id: key, ...financialTransactions[key] };
//                         const category = this.categories.find(find => (find.id === financialTransaction.categoryId));
//                         const paymentMethod = this.paymentMethods.find(find => (find.id === financialTransaction.paymentMethodId));

//                         financialTransaction.categoryId = category ? category.description : '';
//                         financialTransaction.paymentMethodId = paymentMethod ? paymentMethod.description : '';

//                         return financialTransaction;
//                     });
//                 }),
//                 tap(financialTransactions => {
//                     this.financialTransactions = financialTransactions || [];
//                     this.financialTransactionChanged.next(this.financialTransactions.slice());
//                 })
//             )
//             .subscribe();
//     }

//     private _post(financialTransaction: FinancialTransaction) {
//         this.http
//             .post<FinancialTransaction>(
//                 `${environment.firebaseAPI}${environment.firebaseFinancialTransactions}.json`,
//                 financialTransaction
//             )
//             .pipe(
//                 catchError(error => {
//                     this.toastService.createError('Financial Transaction', 'Error adding new financial transaction.');

//                     return throwError(() => {
//                         new Error(error);
//                     });
//                 })
//             )
//             .subscribe(response => {
//                 this._fetch();
//                 this.toastService.createSuccess('Financial Transaction', 'Financial transaction created.');
//             });
//     }

//     private _delete(id: string) {
//         this.http
//             .delete<FinancialTransaction>(
//                 `${environment.firebaseAPI}${environment.firebaseFinancialTransactions}/${id}.json`
//             )
//             .pipe(
//                 catchError(error => {
//                     this.toastService.createError('Financial Transaction', 'Error deleting financial transaction.');

//                     return throwError(() => {
//                         new Error(error);
//                     });
//                 })
//             )
//             .subscribe(() => {
//                 this._fetch();
//                 this.toastService.createSuccess('Financial Transaction', 'Financial transaction deleted.');
//             });
//     }
// }