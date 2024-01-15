import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';

import { FinancialTransaction } from './financial-transaction.model';
import { Subscription } from 'rxjs';
import { FinancialTransactionService } from '../financial-transaction.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../settings/category/category.service';
import { Category } from '../../../settings/category/category.model';
import { PaymentMethod } from '../../../settings/payment-method/payment-method.model';
import { PaymentMethodService } from '../../../settings/payment-method/payment-method.service';

@Component({
  selector: 'app-financial-transaction-modal',
  templateUrl: './financial-transaction-modal.component.html',
  styleUrl: './financial-transaction-modal.component.css'
})
export class FinancialTransactionModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input('modalId') modalId: string;
  @Input('financialTransaction') financialTransaction: FinancialTransaction;
  @Input('isIncome') isIncome: boolean;

  modalTitle: string = 'New Financial Transaction';
  financialTransactionForm: FormGroup;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  private categoriesSubscription: Subscription;
  private paymentMethodsSubscription: Subscription;
  private financialTransactionsSubscription: Subscription;

  constructor(private financialTransactionService: FinancialTransactionService, private categoryService: CategoryService, private paymentMethodService: PaymentMethodService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.modalTitle = (this.financialTransaction) ? 'Update Financial Transaction' : 'New Financial Transaction';

    this.categoryService.fetch();
    // this.categoriesSubscription = this.categoryService.categoriesChanged.subscribe((categories: Category[]) => {
    //   this.categories = categories;
    // });

    this.paymentMethodService.fetchPaymentMethods();
    this.paymentMethodsSubscription = this.paymentMethodService.paymentMethodsChanged.subscribe((paymentMethods: PaymentMethod[]) => {
      this.paymentMethods = paymentMethods;
    });

    this.financialTransactionForm = new FormGroup({
      'description': new FormControl<string>('', [Validators.required]),
      'amount': new FormControl<number>(null, [Validators.required, Validators.min(0.01)]),
      'date': new FormControl<Date>(new Date(), [Validators.required]),
      'categoryId': new FormControl<string>('', [Validators.required]),
      'paymentMethodId': new FormControl<string>('', [Validators.required]),
      'notes': new FormControl<string>(''),
      'tags': new FormArray([]),
    });
  }

  ngOnDestroy(): void {
    if (this.financialTransactionsSubscription) {
      this.financialTransactionsSubscription.unsubscribe();
    }

    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.financialTransaction) {
      if (changes.financialTransaction.currentValue) {
        this.modalTitle = 'Update Financial Transaction';
        this.financialTransactionForm.patchValue({
          'description': changes.financialTransaction.currentValue.description,
          'amount': changes.financialTransaction.currentValue.amount,
          'date': changes.financialTransaction.currentValue.date,
          'categoryId': changes.financialTransaction.currentValue.categoryId,
          'paymentMethodId': changes.financialTransaction.currentValue.paymentMethodId,
          'notes': changes.financialTransaction.currentValue.notes,
          'tags': changes.financialTransaction.currentValue.tags
        });
      }
      else {
        this.modalTitle = 'Update Financial Transaction';
        if (this.financialTransactionForm) {
          this.financialTransactionForm.reset();
        }
      }
    }
  }

  onSubmit() {
    if (!this.financialTransactionForm.valid) {
      return;
    }

    const description = this.financialTransactionForm.value['description'];
    const amount = this.financialTransactionForm.value['amount'];
    const date = this.financialTransactionForm.value['date'];
    const categoryId = this.financialTransactionForm.value['categoryId'];
    const paymentMethodId = this.financialTransactionForm.value['paymentMethodId'];
    const notes = this.financialTransactionForm.value['notes'];
    const tags = this.financialTransactionForm.value['tags'];

    if (this.financialTransaction) {
      this.financialTransaction.description = description;
      this.financialTransaction.amount = amount;
      this.financialTransaction.date = date;
      this.financialTransaction.categoryId = categoryId;
      this.financialTransaction.paymentMethodId = paymentMethodId;
      this.financialTransaction.notes = notes;
      this.financialTransaction.tags = tags;

      //
    }
    else {
      const newFinancialTransaction = new FinancialTransaction(
        null,
        description,
        amount,
        date,
        categoryId,
        paymentMethodId,
        notes,
        tags,
        this.isIncome
      );

      this.financialTransactionService.post(newFinancialTransaction);
    }

    this.financialTransactionForm.reset();
    this.onCloseModal();
  }

  onCloseModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'none');
  }

  getTags() {
    return (<FormArray>this.financialTransactionForm.get('tags')).controls;
  }

  onAddTag() {
    const control = new FormControl(null, Validators.required);

    (<FormArray>this.financialTransactionForm.get('tags')).push(control);
  }
}
