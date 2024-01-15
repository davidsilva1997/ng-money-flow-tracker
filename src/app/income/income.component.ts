import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { FinancialTransactionService } from '../shared/financial-transaction/financial-transaction.service';
import { FinancialTransaction } from '../shared/financial-transaction/financial-transaction-modal/financial-transaction.model';
import { ToastService } from '../shared/toast/toast.service';
import { Category } from '../settings/category/category.model';
import { PaymentMethod } from '../settings/payment-method/payment-method.model';
import { CategoryService } from '../settings/category/category.service';
import { PaymentMethodService } from '../settings/payment-method/payment-method.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit, OnDestroy {
  financialTransactionsSubject: BehaviorSubject<FinancialTransaction[]>;
  private financialTransactionsChanged: Subscription;

  modalId: string = 'modalFinancialTransactionId';
  financialTransactionToUpdate: FinancialTransaction;
  categoriesSubject: BehaviorSubject<Category[]>;
  paymentMethodsSubject: BehaviorSubject<PaymentMethod[]>;

  constructor(private financialTransactionService: FinancialTransactionService, private categoryService: CategoryService, private paymentMethodService: PaymentMethodService, private toastService: ToastService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.financialTransactionsSubject = new BehaviorSubject<FinancialTransaction[]>([]);
    this.financialTransactionToUpdate = null;

    this.categoriesSubject = new BehaviorSubject<Category[]>([]);
    this.paymentMethodsSubject = new BehaviorSubject<PaymentMethod[]>([]);

    this.categoryService.fetch().subscribe(categories => {
      this.categoriesSubject.next(categories);
    });

    this.paymentMethodService.fetch().subscribe(paymentMethods => {
      this.paymentMethodsSubject.next(paymentMethods);
    });

    this._refreshFinancialTransactions();

    this.financialTransactionsChanged = this.financialTransactionService.financialTransactionsChangedSubject.subscribe(() => {
      this._refreshFinancialTransactions();
    });
  }

  ngOnDestroy(): void {
    if (this.financialTransactionsChanged) {
      this.financialTransactionsChanged.unsubscribe();
    }
  }

  onAdd() {
    this.financialTransactionToUpdate = null;

    this._openModal();
  }

  onUpdate(financialTransaction: FinancialTransaction) {
    this.financialTransactionToUpdate = financialTransaction;

    this._openModal();
  }

  onDelete(id: string) {
    this.financialTransactionService.delete(id).subscribe({
      next: () => {
        this.toastService.createSuccess('Financial Transaction', 'Financial transaction deleted successfully.')
        this._refreshFinancialTransactions();
      },
      error: (error) => {
        this.toastService.createError('Financial Transaction', 'Error deleting financial transaction.');
      }
    });
  }

  private _openModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'block');
  }

  private _refreshFinancialTransactions() {
    this.financialTransactionService.fetch().subscribe(financialTransactions => {
      financialTransactions.forEach(financialTransaction => {
        if (!this.categoriesSubject.value) {
          return;
        }

        const category = this.categoriesSubject.value.find(find => (find.id === financialTransaction.categoryId));

        if (!this.paymentMethodsSubject.value) {
          return;
        }

        const paymentMethod = this.paymentMethodsSubject.value.find(find => (find.id === financialTransaction.paymentMethodId));

        financialTransaction.category = (category) ? category.description : 'unknown';
        financialTransaction.paymentMethod = (paymentMethod) ? paymentMethod.description : 'unknown';
      });

      this.financialTransactionsSubject.next(financialTransactions.filter(filter => filter.isIncome));
    })
  }
}