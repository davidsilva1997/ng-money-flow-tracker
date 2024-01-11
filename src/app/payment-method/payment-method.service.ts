import { Subject } from "rxjs";
import { PaymentMethod } from "./payment-method.model";

export class PaymentMethodService {
    paymentMethodsChanged = new Subject<PaymentMethod[]>();
    private paymentMethods: PaymentMethod[] = [
        new PaymentMethod('Card'),
        new PaymentMethod('Cash'),
        new PaymentMethod('Paypal'),
        new PaymentMethod('MBWay')
    ];

    getPaymentMethods() {
        return this.paymentMethods.slice();
    }

    addPaymentMethod(paymentMethod: PaymentMethod) {
        const exists = this.paymentMethods.find(find => (find.description === paymentMethod.description));

        if (exists) {
            return;
        }
        
        this.paymentMethods.push(paymentMethod);
        this.paymentMethodsChanged.next(this.paymentMethods.slice());
    }
}