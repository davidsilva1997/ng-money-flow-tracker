import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { PaymentMethod } from './payment-method.model';
import { PaymentMethodService } from './payment-method.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css'
})
export class PaymentMethodComponent implements OnInit, OnDestroy {
  paymentMethods: PaymentMethod[];
  paymentMethodToUpdate: PaymentMethod;
  modalId: string = 'modalPaymentMethodId';
  private paymentMethodsSubscription: Subscription;

  constructor(private paymentMethodService: PaymentMethodService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.paymentMethodToUpdate = null;
    this.paymentMethods = this.paymentMethodService.fetchPaymentMethods();

    this.paymentMethodsSubscription = this.paymentMethodService.paymentMethodsChanged.subscribe((paymentMethods: PaymentMethod[]) => {
      this.paymentMethods = paymentMethods;
    });
  }

  ngOnDestroy(): void {
    this.paymentMethodsSubscription.unsubscribe();
  }

  onAdd() {
    this.paymentMethodToUpdate = null;

    this._openModal();
  }

  onUpdate(paymentMethod) {
    this.paymentMethodToUpdate = paymentMethod;

    this._openModal();
  }

  onDelete(id: string) {
    this.paymentMethodService.deletePaymentMethod(id);
  }


  private _openModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'block');
  }
}
