import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { FinancialTransaction } from '../../../shared/financial-transaction/financial-transaction-modal/financial-transaction.model';
import { FinancialTransactionService } from '../../../shared/financial-transaction/financial-transaction.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  financialTransactions: FinancialTransaction[];

  dataByMonth: { [monthYear: string]: { income: number; expense: number } } = {};

  chartLabels: string[] = [];
  barChartData: ChartData<'bar'>;
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  constructor(private financialTransactionService: FinancialTransactionService) { }

  ngOnInit(): void {
    this._loadData();
  }

  private _loadData() {
    this.financialTransactionService.fetch().subscribe(result => {
      this.financialTransactions = result.financialTransactions;

      this._processData();
      this._updateChartData();
    });
  }

  private _processData() {
    this.financialTransactions.forEach(transaction => {
      const monthYear = new Date(transaction.date).toLocaleString('en-us', { month: 'short', year: 'numeric' });
      const amount = transaction.amount;

      if (!this.dataByMonth[monthYear]) {
        this.dataByMonth[monthYear] = { income: 0, expense: 0 };
        this.chartLabels.push(monthYear);
      }

      if (transaction.isIncome) {
        this.dataByMonth[monthYear].income += amount;
      }
      else {
        this.dataByMonth[monthYear].expense += amount;
      }
    });

    this.chartLabels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  private _updateChartData() {
    const incomeData = [];
    const expenseData = [];

    this.chartLabels.forEach(monthYear => {
      const data = this.dataByMonth[monthYear];
      incomeData.push(data ? data.income : 0);
      expenseData.push(data ? data.expense : 0);
    });

    this.barChartData = {
      labels: this.chartLabels,
      datasets: [
        { data: incomeData, label: 'Income', backgroundColor: 'rgba(123,213,133, 0.7)' },
        { data: expenseData, label: 'Expense', backgroundColor: 'rgba(245, 85, 74, 0.7)' }
      ]
    }
  }

  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {},
      y: {
        min: 10,
        ticks: {
          callback: function (value, index, values) {
            return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
          }
        }
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => {
          return this._currencyFormatter.format(value);
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItems) => {
            let label = tooltipItems.dataset.label;
            let value = this._currencyFormatter.format(tooltipItems.parsed.y);

            return `${label}: ${value}`;
          }
        }
      }
    }
  }

  private _currencyFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
}