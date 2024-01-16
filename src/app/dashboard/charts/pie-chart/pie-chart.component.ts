import { Component, Input, OnInit, ViewChild } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { FinancialTransaction } from '../../../shared/financial-transaction/financial-transaction-modal/financial-transaction.model';
import { FinancialTransactionService } from '../../../shared/financial-transaction/financial-transaction.service';
import { Category } from '../../../settings/category/category.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input('isIncome') isIncome: boolean;
  financialTransactions: FinancialTransaction[];
  chartCategories: { [category: string]: { amount: number } } = {};

  private colorPaletteIncome: string[] = ['rgba(210, 184, 229, 0.7)', 'rgba(195, 112, 225, 0.7)', 'rgba(130, 130, 230, 0.7)', 'rgba(138, 251, 255, 0.7)', 'rgba(255, 255, 205, 0.7)'];
  private colorPaletteExpenses: string[] = ['rgba(218, 248, 227, 0.7)', 'rgba(151, 235, 219, 0.7)', 'rgba(0, 194, 199, 0.7)', 'rgba(0, 134, 173, 0.7)', 'rgba(0, 85, 130, 0.7)'];

  chartLabels: string[] = [];

  pieChartData: ChartData<'pie'>;
  public pieChartType: ChartType;
  public pieChartPlugins = [DatalabelsPlugin];
  public pieChartOptions: ChartConfiguration['options'];

  constructor(private financialTransactionService: FinancialTransactionService) {
    this.pieChartType = 'pie';
    this.pieChartOptions = {
      plugins: {
        legend: {
          display: true
        },
        datalabels: {
          formatter: (value: any, ctx: any) => {
            if (ctx.chart.data.labels) {
              const label = ctx.chart.data.labels[ctx.dataIndex];
              const currentValue = this._currencyFormatter.format(value);

              return `${label}: ${currentValue}`;
            }
          },
        },
        tooltip: {
          callbacks: {
          label: (tooltipItems) => {
            let label = tooltipItems.label;
            let value = this._currencyFormatter.format(tooltipItems.parsed);

            return `${label}: ${value}`;
          }
        }
        }
      }
    }
  }

  ngOnInit(): void {
    this.pieChartOptions.plugins.legend.position = (this.isIncome) ? 'left' : 'right';
    this._loadData();
  }

  private _loadData() {
    this.financialTransactionService.fetch().subscribe(result => {
      this.financialTransactions = result.financialTransactions.filter(filter => (filter.isIncome === this.isIncome));

      this._transformCategories(result.categories);
      this._processData();
      this._updateChartData();
    });
  }

  private _transformCategories(categories: Category[]) {
    this.financialTransactions.forEach(financialTransaction => {
      const category = categories.find(find => (find.id === financialTransaction.categoryId));

      financialTransaction.categoryId = (category) ? category.description : 'unknown';
    });
  }

  private _processData() {
    this.financialTransactions.forEach(financialTransaction => {
      const category = financialTransaction.categoryId;
      const amount = financialTransaction.amount;

      if (!this.chartCategories[category]) {
        this.chartCategories[category] = { amount: 0 };
        this.chartLabels.push(category);
      }

      this.chartCategories[category].amount += amount;
    });
  }

  private _updateChartData() {
    const amountData = [];

    this.chartLabels.forEach(category => {
      const data = this.chartCategories[category];

      amountData.push(data ? data.amount : 0);
    });

    this.pieChartData = {
      labels: this.chartLabels,
      datasets: [
        { data: amountData, backgroundColor: (this.isIncome) ? this.colorPaletteIncome : this.colorPaletteExpenses }
      ]
    }
  }

  private _currencyFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
}
