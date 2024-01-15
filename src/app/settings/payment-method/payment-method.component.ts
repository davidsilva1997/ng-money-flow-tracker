import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { PaymentMethod } from './payment-method.model';
import { PaymentMethodService } from './payment-method.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css'
})
export class PaymentMethodComponent implements OnInit, OnDestroy {
  paymentMethodsSubject: BehaviorSubject<PaymentMethod[]>;
  private paymentMethodsChanged: Subscription;

  modalId: string = 'modalPaymentMethodId';
  paymentMethodToUpdate: PaymentMethod;

  constructor(private paymentMethodService: PaymentMethodService, private toastService: ToastService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.paymentMethodsSubject = new BehaviorSubject<PaymentMethod[]>([]);
    this.paymentMethodToUpdate = null;

    this.paymentMethodService.fetch().subscribe(paymentMethods => {
      this.paymentMethodsSubject.next(paymentMethods);
    });

    this.paymentMethodsChanged = this.paymentMethodService.paymentMethodsChangedSubject.subscribe(() => {
      this._refreshPaymentMethods();
    });
  }

  ngOnDestroy(): void {
    if (this.paymentMethodsChanged) {
      this.paymentMethodsChanged.unsubscribe();
    }
  }

  onAdd() {
    this.paymentMethodToUpdate = null;

    this._openModal();
  }

  onUpdate(paymentMethod: PaymentMethod) {
    this.paymentMethodToUpdate = paymentMethod;

    this._openModal();
  }

  onDelete(id: string) {
    this.paymentMethodService.delete(id).subscribe({
      next: () => {
        this.toastService.createSuccess('Payment Method', 'Payment method deleted successfully.')
        this._refreshPaymentMethods();
      },
      error: (error) => {
        this.toastService.createError('Payment Method', 'Error deleting payment method.');
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

  private _refreshPaymentMethods() {
    this.paymentMethodService.fetch().subscribe(paymentMethods => {
      this.paymentMethodsSubject.next(paymentMethods);
    });
  }
}