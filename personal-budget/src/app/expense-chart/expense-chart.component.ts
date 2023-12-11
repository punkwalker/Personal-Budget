import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../data.service'

Chart.register(...registerables);
@Component({
  selector: 'pb-expense-chart',
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.scss']
})
export class ExpenseChartComponent implements AfterViewInit {
  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: []
        }
    ],
    labels: []
};

myPieChart:any;

  constructor(private dataService:DataService){}

  ngAfterViewInit(): void {
  }

  private getRandomColor():string {
    var color = '#';
    var letters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

  public renderData(userObjectID:string, month:string)
  {
    this.dataService.getAllExpensesByMonthForUser(userObjectID, 'Jan').subscribe((data:any) => {
      for (var i = 0; i < data.length; i++) {
        this.dataSource.datasets[0].data[i] = data[i].expense as never;
        this.dataSource.labels[i] = data[i].category as never;
        this.dataSource.datasets[0].backgroundColor[i] = this.getRandomColor() as never;
      }
      this.createChart();
    });
  }

  public updateData(userObjectID:string, month:string){
      this.dataService.getAllExpensesByMonthForUser(userObjectID, month).subscribe((data:any) => {
        this.dataSource.datasets[0].data = [];
        this.dataSource.labels = [];
        this.dataSource.datasets[0].backgroundColor = [];

        for (var i = 0; i < data.length; i++) {
          this.dataSource.datasets[0].data[i] = data[i].expense as never;
          this.dataSource.labels[i] = data[i].category as never;
          this.dataSource.datasets[0].backgroundColor[i] = this.getRandomColor() as never;
        }
        this.myPieChart.update();
      });
  }

  createChart() {
    var ctx = document.getElementById('myExpenseChart') as HTMLCanvasElement;
    this.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }

}
