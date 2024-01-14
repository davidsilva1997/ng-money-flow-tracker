import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { IncomeComponent } from "./income/income.component";
import { ExpenseComponent } from "./expense/expense.component";
import { SettingsComponent } from "./settings/settings.component";

const routes = [
    { path: '', component: DashboardComponent },
    { path: 'incomes', component: IncomeComponent },
    { path: 'expenses', component: ExpenseComponent },
    { path: 'settings', component: SettingsComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }