import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';

import { FinancialTransaction } from './financial-transaction.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FinancialTransactionService } from '../financial-transaction.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../settings/category/category.service';
import { Category } from '../../../settings/category/category.model';
import { PaymentMethod } from '../../../settings/payment-method/payment-method.model';
import { PaymentMethodService } from '../../../settings/payment-method/payment-method.service';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-financial-transaction-modal',
  templateUrl: './financial-transaction-modal.component.html',
  styleUrl: './financial-transaction-modal.component.css'
})
export class FinancialTransactionModalComponent implements OnInit, OnChanges {
  @Input('modalId') modalId: string;
  @Input('financialTransaction') financialTransaction: FinancialTransaction;
  @Input('isIncome') isIncome: boolean;
  modalTitle: string;
  financialTransactionForm: FormGroup;
  categoriesSubject: BehaviorSubject<Category[]>;
  paymentMethodsSubject: BehaviorSubject<PaymentMethod[]>;

  constructor(private financialTransactionService: FinancialTransactionService, private categoryService: CategoryService, private paymentMethodService: PaymentMethodService, private toastService: ToastService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.modalTitle = (this.financialTransaction) ? 'Update Financial Transaction' : 'New Financial Transaction';
    this.financialTransactionForm = new FormGroup({
      'description': new FormControl<string>('', [Validators.required]),
      'amount': new FormControl<number>(null, [Validators.required, Validators.min(0.01)]),
      'date': new FormControl<Date>(new Date(), [Validators.required]),
      'categoryId': new FormControl<string>('', [Validators.required]),
      'paymentMethodId': new FormControl<string>('', [Validators.required]),
      'notes': new FormControl<string>(''),
      'tags': new FormArray([]),
    });

    this.categoriesSubject = new BehaviorSubject<Category[]>([]);
    this.paymentMethodsSubject = new BehaviorSubject<PaymentMethod[]>([]);

    this.categoryService.fetch().subscribe(categories => {
      this.categoriesSubject.next(categories);
    });

    this.paymentMethodService.fetch().subscribe(paymentMethods => {
      this.paymentMethodsSubject.next(paymentMethods);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.financialTransaction) {
      if (changes.financialTransaction.currentValue) {
        this._deleteTags();
        this._refreshTags(changes.financialTransaction.currentValue.tags);

        this.modalTitle = 'Update Financial Transaction';
        this.financialTransactionForm.patchValue({
          'description': changes.financialTransaction.currentValue.description,
          'amount': changes.financialTransaction.currentValue.amount,
          'date': changes.financialTransaction.currentValue.date,
          'categoryId': changes.financialTransaction.currentValue.categoryId,
          'paymentMethodId': changes.financialTransaction.currentValue.paymentMethodId,
          'notes': changes.financialTransaction.currentValue.notes
        });
      }
      else {
        this.modalTitle = 'New Financial Transaction';
        if (this.financialTransactionForm) {
          this.financialTransactionForm.reset();
          this._deleteTags();
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

      this.financialTransactionService.put(this.financialTransaction).subscribe({
        next: () => {
          this.toastService.createSuccess('Financial Transaction', 'Financial Transaction updated successfully.');
          this.financialTransactionService.financialTransactionsChangedSubject.next();
        },
        error: (error) => {
          this.toastService.createError('Financial Transaction', 'Error updating financial transaction.');
        }
      });
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

      this.financialTransactionService.post(newFinancialTransaction).subscribe({
        next: () => {
          this.toastService.createSuccess('Financial Transaction', 'New financial transaction created successfully.');
          this.financialTransactionService.financialTransactionsChangedSubject.next();
        },
        error: (error) => {
          this.toastService.createError('Financial Transaction', 'Error creating the new financial transaction.');
        }
      });
    }

    this.financialTransactionForm.reset();
    this.onCloseModal();
  }

  getTags() {
    return (<FormArray>this.financialTransactionForm.get('tags')).controls;
  }

  onAddTag() {
    const control = new FormControl(null, Validators.required);

    (<FormArray>this.financialTransactionForm.get('tags')).push(control);
  }

  private _deleteTags() {
    const tagsArray = this.financialTransactionForm.get('tags') as FormArray;

    while (tagsArray.length) {
      tagsArray.removeAt(0);
    }
  }

  private _refreshTags(tags: string[]) {
    if (tags) {
      tags.forEach(tag => {
        const control = new FormControl(tag, Validators.required);

        (<FormArray>this.financialTransactionForm.get('tags')).push(control);
      });
    }
  }

  onCloseModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'none');
    this.financialTransactionForm.reset();
  }
}