import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { FinancialTransaction } from '../shared/financial-transaction/financial-transaction-modal/financial-transaction.model';
import { FinancialTransactionService } from '../shared/financial-transaction/financial-transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  financialTransactionsSubject: BehaviorSubject<FinancialTransaction[]>;
  private financialTransactionsChanged: Subscription;

  constructor(private financialTransactionService: FinancialTransactionService) { }

  ngOnInit(): void {
    this.financialTransactionsSubject = new BehaviorSubject<FinancialTransaction[]>([]);

    this.financialTransactionsChanged = this.financialTransactionService.financialTransactionsChangedSubject.subscribe(() => {
      this._refreshFinancialTransactions();
    });

    this._refreshFinancialTransactions();
  }

  ngOnDestroy(): void {
    if (this.financialTransactionsChanged) {
      this.financialTransactionsChanged.unsubscribe();
    }
  }

  private _refreshFinancialTransactions() {
    this.financialTransactionService.fetch().subscribe(response => {
      response.financialTransactions.forEach(financialTransaction => {
        let categoryDescription;
        let paymentMethodDescription;

        if (response.categories) {
          let category = response.categories.find(find => (find.id === financialTransaction.categoryId));

          categoryDescription = (category) ? category.description : 'unknown';
        }

        if (response.paymentMethods) {
          let paymentMethod = response.paymentMethods.find(find => (find.id === financialTransaction.paymentMethodId));

          paymentMethodDescription = (paymentMethod) ? paymentMethod.description : 'unknown';
        }

        financialTransaction.category = categoryDescription;
        financialTransaction.paymentMethod = paymentMethodDescription;
      });

      this.financialTransactionsSubject.next(response.financialTransactions);
    });
  }
}
