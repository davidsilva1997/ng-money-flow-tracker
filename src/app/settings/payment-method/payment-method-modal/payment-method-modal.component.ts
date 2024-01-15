import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PaymentMethodService } from '../payment-method.service';
import { PaymentMethod } from '../payment-method.model';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-payment-method-modal',
  templateUrl: './payment-method-modal.component.html',
  styleUrl: './payment-method-modal.component.css'
})
export class PaymentMethodModalComponent implements OnInit, OnChanges {
  @Input('modalId') modalId: string;
  @Input('paymentMethod') paymentMethod: PaymentMethod;
  modalTitle: string;
  paymentMethodForm: FormGroup;
  paymentMethodsDescriptionSubject: BehaviorSubject<string[]>;

  constructor(private paymentMethodService: PaymentMethodService, private toastService: ToastService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.modalTitle = (this.paymentMethod) ? 'Update Payment Method' : 'New Payment Method';
    this.paymentMethodForm = new FormGroup({
      'description': new FormControl('', [Validators.required, this.validatePaymentMethods.bind(this)])
    });

    this.paymentMethodsDescriptionSubject = new BehaviorSubject<string[]>([]);

    this.paymentMethodService.paymentMethodsChangedSubject.subscribe(() => {
      this.paymentMethodService.fetch().subscribe(paymentMethods => {
        this.paymentMethodsDescriptionSubject.next(paymentMethods.map(map => map.description.toUpperCase()));
      });
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
          this.paymentMethodForm.reset();
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
      this.paymentMethodService.put(this.paymentMethod).subscribe({
        next: () => {
          this.toastService.createSuccess('Payment Method', 'Payment Method updated successfully.');
          this.paymentMethodService.paymentMethodsChangedSubject.next();
        },
        error: (error) => {
          this.toastService.createError('Payment Method', 'Error updating payment method.');
        }
      });
    }
    else {
      const newPaymentMethod = new PaymentMethod(null, description);

      this.paymentMethodService.post(newPaymentMethod).subscribe({
        next: () => {
          this.toastService.createSuccess('Payment Method', 'New payment method created successfully.');
          this.paymentMethodService.paymentMethodsChangedSubject.next();
        },
        error: (error) => {
          this.toastService.createError('Payment Method', 'Error creating the new payment method.');
        }
      });
    }

    this.paymentMethodForm.reset();
    this.onCloseModal();
  }

  onCloseModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'none');
  }

  validatePaymentMethods(control: FormControl): { [s: string]: boolean } {
    const description = control.value ? control.value.toUpperCase() : control.value;

    if (this.paymentMethodsDescriptionSubject && (this.paymentMethodsDescriptionSubject.value.indexOf(description) !== -1)) {
      return { 'paymentMethodAlreadyExists': true }
    }

    return null;
  }
}
// export class PaymentMethodModalComponent implements OnInit, OnDestroy, OnChanges {
//   @Input('modalId') modalId: string;
//   @Input('paymentMethod') paymentMethod: PaymentMethod;

//   modalTitle: string = 'New Payment Method';
//   paymentMethodForm: FormGroup;
//   existingPaymentMethodsDescriptions: string[];
//   private paymentMethodsSubscription: Subscription;

//   constructor(private paymentMethodService: PaymentMethodService, private renderer: Renderer2, private elementRef: ElementRef) { }

//   ngOnInit(): void {
//     this.existingPaymentMethodsDescriptions = this.paymentMethodService.fetchPaymentMethods().map(map => map.description.toUpperCase());

//     this.paymentMethodsSubscription = this.paymentMethodService.paymentMethodsChanged.subscribe((paymentMethods: PaymentMethod[]) => {
//       this.existingPaymentMethodsDescriptions = paymentMethods.map(map => map.description.toUpperCase());
//     });

//     this.modalTitle = (this.paymentMethod) ? 'Update Payment Method' : 'New Payment Method';

//     this.paymentMethodForm = new FormGroup({
//       'description': new FormControl('', [Validators.required, this.validatePaymentMethods.bind(this)])
//     });
//   }

//   ngOnDestroy(): void {
//     this.paymentMethodsSubscription.unsubscribe();
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.paymentMethod) {
//       if (changes.paymentMethod.currentValue) {
//         this.modalTitle = 'Update Payment Method';
//         this.paymentMethodForm.patchValue({
//           'description': changes.paymentMethod.currentValue.description
//         });
//       }
//       else {
//         this.modalTitle = 'New Payment Method';
//         if (this.paymentMethodForm) {
//           this.paymentMethodForm.patchValue({
//             'description': ''
//           });
//         }
//       }
//     }
//   }

//   onSubmit() {
//     if (!this.paymentMethodForm.valid) {
//       return;
//     }

//     const description = this.paymentMethodForm.value['description'];

//     if (this.paymentMethod) {
//       this.paymentMethod.description = description;
//       this.paymentMethodService.putPaymentMethod(this.paymentMethod);
//     }
//     else {
//       const newPaymentMethod = new PaymentMethod(null, description);

//       this.paymentMethodService.postPaymentMethod(newPaymentMethod);
//     }

//     this.paymentMethodForm.reset();
//     this.onCloseModal();
//   }

//   validatePaymentMethods(control: FormControl): { [s: string]: boolean } {
//     const description = control.value ? control.value.toUpperCase() : control.value;

//     if (this.existingPaymentMethodsDescriptions.indexOf(description) !== -1) {
//       return { 'paymentMethodAlreadyExists': true }
//     }

//     return null;
//   }

//   onCloseModal() {
//     const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

//     if (!modalElement) {
//       return;
//     }

//     this.renderer.setStyle(modalElement, 'display', 'none');
//   }
// }
