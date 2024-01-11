import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PaymentMethodService } from '../../../payment-method/payment-method.service';
import { PaymentMethod } from '../../../payment-method/payment-method.model';

@Component({
  selector: 'app-payment-method-modal',
  templateUrl: './payment-method-modal.component.html',
  styleUrl: './payment-method-modal.component.css'
})
export class PaymentMethodModalComponent implements OnInit {
  paymentMethodForm: FormGroup;
  modalId: string = 'paymentMethodModalId';
  paymentMethodsDescriptions: string[];
  private paymentMethodsSubscription: Subscription;

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private paymentMethodService: PaymentMethodService) { }

  ngOnInit(): void {
    this.paymentMethodsDescriptions = this.paymentMethodService.getPaymentMethods().map(map => map.description);

    this.paymentMethodsSubscription = this.paymentMethodService.paymentMethodsChanged.subscribe((paymentMethods: PaymentMethod[]) => {
      this.paymentMethodsDescriptions = paymentMethods.map(map => map.description);
    });
    
    this.paymentMethodForm = new FormGroup({
      'description': new FormControl('', [Validators.required, this.validatePaymentMethods.bind(this)])
    });
  }

  onSubmit() {
    if (!this.paymentMethodForm.valid) {
      return;
    }

    const paymentMethod = new PaymentMethod(
      this.paymentMethodForm.value['description']
    );

    this.paymentMethodService.addPaymentMethod(paymentMethod);

    this.paymentMethodForm.reset();
    this.closeModal();
  }

  openModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'block');
  }

  closeModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'none');
  }

  validatePaymentMethods(control: FormControl): { [s: string]: boolean} {
    if (this.paymentMethodsDescriptions.indexOf(control.value) !== -1) {
      return { 'paymentMethodAlreadyExists': true }
    }

    return null;
  }
}
