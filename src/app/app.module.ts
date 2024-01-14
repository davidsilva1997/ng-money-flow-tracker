import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentMethodModalComponent } from './payment-method/payment-method-modal/payment-method-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { SettingsComponent } from './settings/settings.component';
import { AppRoutingModule } from './app-routing.model';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaymentMethodComponent,
    PaymentMethodModalComponent,
    DashboardComponent,
    IncomeComponent,
    ExpenseComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
