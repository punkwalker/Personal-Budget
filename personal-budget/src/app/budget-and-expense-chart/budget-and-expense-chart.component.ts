import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../data.service'

Chart.register(...registerables);

@Component({
  selector: 'pb-budget-and-expense-chart',
  templateUrl: './budget-and-expense-chart.component.html',
  styleUrls: ['./budget-and-expense-chart.component.scss']
})
export class BudgetAndExpenseChartComponent implements AfterViewInit {

  budgetDataset:any = {
    label: 'Budget Goals',
    data: [],
    backgroundColor: [
      'rgba(75, 192, 192, 0.2)'
    ],
    borderColor: [
      'rgba(75, 192, 192, 1)'
    ],
    borderWidth: 1
    };

    expenseDataset:any = {
      label: 'Expenses',
      data: [],
      backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1
  };

  budgetLabels:any = [];

  myBarChart:any;

  constructor(private dataService:DataService){}

  ngAfterViewInit(): void {
  }

  public renderData(userObjectID:string, month:string)
  {
    this.dataService.getBudgetData(userObjectID).subscribe((data:any) => {
      for (var i = 0; i < data[0].budget.length; i++) {
        this.budgetDataset.data[i] = data[0].budget[i].budget;
        this.budgetLabels[i] = data[0].budget[i].title;
      }

      this.dataService.getAllExpensesByMonthForUser(userObjectID, month).subscribe((data:any) => {
        for (var i = 0; i < data.length; i++) {
          const idx = this.budgetLabels.findIndex((x: any) => data[i].category == x);
          this.expenseDataset.data[idx] = data[i].expense;
        }
        this.createChart();
      });
    });
  }

  public updateData(userObjectID:string, month:string){

    this.dataService.getBudgetData(userObjectID).subscribe((data:any) => {
      this.budgetLabels = [];
        this.budgetDataset.data = [];

      for (var i = 0; i < data[0].budget.length; i++) {
        this.budgetDataset.data[i] = data[0].budget[i].budget;
        this.budgetLabels[i] = data[0].budget[i].title;
      }

      this.dataService.getAllExpensesByMonthForUser(userObjectID, month).subscribe((data:any) => {
        this.expenseDataset.data = [];

        for (var i = 0; i < data.length; i++) {
          const idx = this.budgetLabels.findIndex((x: any) => data[i].category == x);
          this.expenseDataset.data[idx] = data[i].expense;
        }
        //this.resetCanvas();

        if (this.myBarChart != null)
        {
          this.myBarChart.data.labels= [];
          this.myBarChart.data.labels= this.budgetLabels;
          this.myBarChart.data.datasets = [];
          this.myBarChart.data.datasets.push(this.budgetDataset);
          this.myBarChart.data.datasets.push(this.expenseDataset);
          this.myBarChart.update();
        }
        else{
          this.createChart();
        }

      });
    });
  }

  private createChart():any {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
                labels: this.budgetLabels,
                datasets: [
                  this.budgetDataset,
                  this.expenseDataset
                ]
              },
        options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  },
                  responsive:true,
              }
    });
  }
}
