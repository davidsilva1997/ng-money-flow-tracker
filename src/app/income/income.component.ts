import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FinancialTransactionService } from '../shared/financial-transaction/financial-transaction.service';
import { FinancialTransaction } from '../shared/financial-transaction/financial-transaction-modal/financial-transaction.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit, OnDestroy {
  modalId: string = 'modalFinancialTransactionId';
  financialTransactionToUpdate: FinancialTransaction;
  financialTransactions: FinancialTransaction[];
  private financialTransactionsSubscription: Subscription;

  constructor(private financialTransactionService: FinancialTransactionService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.financialTransactionToUpdate = null;
    this.financialTransactionService.fetch();

    this.financialTransactionsSubscription = this.financialTransactionService.financialTransactionChanged.subscribe((financialTransactions: FinancialTransaction[]) => {
      this.financialTransactions = financialTransactions.filter(filter => (filter.isIncome));
    })
  }

  ngOnDestroy(): void {
    this.financialTransactionsSubscription.unsubscribe();
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
    this.financialTransactionService.delete(id);
  }

  private _openModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'block');
  }
}
