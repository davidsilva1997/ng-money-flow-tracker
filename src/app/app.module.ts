import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentMethodModalComponent } from './payment-method/payment-method-modal/payment-method-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaymentMethodComponent,
    PaymentMethodModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
