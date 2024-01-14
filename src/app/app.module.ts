import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PaymentMethodComponent } from './settings/payment-method/payment-method.component';
import { PaymentMethodModalComponent } from './settings/payment-method/payment-method-modal/payment-method-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { SettingsComponent } from './settings/settings.component';
import { AppRoutingModule } from './app-routing.model';
import { CategoryComponent } from './settings/category/category.component';
import { CategoryModalComponent } from './settings/category/category-modal/category-modal.component';
import { FinancialTransactionModalComponent } from './shared/financial-transaction/financial-transaction-modal/financial-transaction-modal.component';

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
    CategoryComponent,
    CategoryModalComponent,
    FinancialTransactionModalComponent,
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
