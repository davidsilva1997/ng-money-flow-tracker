import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentMethodService } from '../payment-method.service';
import { PaymentMethod } from '../payment-method.model';

@Component({
  selector: 'app-payment-method-modal',
  templateUrl: './payment-method-modal.component.html',
  styleUrl: './payment-method-modal.component.css'
})
export class PaymentMethodModalComponent implements OnInit, OnChanges {
  @Input('modalId') modalId: string;
  @Input('paymentMethod') paymentMethod: PaymentMethod;

  modalTitle: string = 'New Payment Method';
  paymentMethodForm: FormGroup;
  existingPaymentMethodsDescriptions: string[];
  private paymentMethodsSubscription: Subscription;

  constructor(private paymentMethodService: PaymentMethodService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.existingPaymentMethodsDescriptions = this.paymentMethodService.fetchPaymentMethods().map(map => map.description.toUpperCase());

    this.paymentMethodsSubscription = this.paymentMethodService.paymentMethodsChanged.subscribe((paymentMethods: PaymentMethod[]) => {
      this.existingPaymentMethodsDescriptions = paymentMethods.map(map => map.description.toUpperCase());
    });

    this.modalTitle = (this.paymentMethod) ? 'Update Payment Method' : 'New Payment Method';

    this.paymentMethodForm = new FormGroup({
      'description': new FormControl('', [Validators.required, this.validatePaymentMethods.bind(this)])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paymentMethod) {
      if (changes.paymentMethod.currentValue) {
        this.modalTitle = 'Update Payment Method';
        this.paymentMethodForm.patchValue({
          'description': changes.paymentMethod.currentValue.description
        });
      }
      else {
        this.modalTitle = 'New Payment Method';
        if (this.paymentMethodForm) {
          this.paymentMethodForm.patchValue({
            'description': ''
          });
        }
      }
    }
  }

  onSubmit() {
    if (!this.paymentMethodForm.valid) {
      return;
    }

    const description = this.paymentMethodForm.value['description'];

    if (this.paymentMethod) {
      this.paymentMethod.description = description;
      this.paymentMethodService.putPaymentMethod(this.paymentMethod);
    }
    else {
      const newPaymentMethod = new PaymentMethod(null, description);

      this.paymentMethodService.postPaymentMethod(newPaymentMethod);
    }

    this.paymentMethodForm.reset();
    this.onCloseModal();
  }

  validatePaymentMethods(control: FormControl): { [s: string]: boolean } {
    const description = control.value ? control.value.toUpperCase() : control.value;

    if (this.existingPaymentMethodsDescriptions.indexOf(description) !== -1) {
      return { 'paymentMethodAlreadyExists': true }
    }

    return null;
  }

  onCloseModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'none');
  }
}
