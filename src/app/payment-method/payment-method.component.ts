import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  private paymentMethodsSubscription: Subscription;

  constructor(private paymentMethodService: PaymentMethodService) { }

  ngOnInit(): void {
    this.paymentMethods = this.paymentMethodService.getPaymentMethods();

    this.paymentMethodsSubscription = this.paymentMethodService.paymentMethodsChanged.subscribe((paymentMethods: PaymentMethod[]) => {
      this.paymentMethods = paymentMethods;
    });
  }

  ngOnDestroy(): void {
    this.paymentMethodsSubscription.unsubscribe();
  }
}
