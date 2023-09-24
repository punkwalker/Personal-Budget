import { AfterViewInit, Component } from '@angular/core';
import {Chart} from 'chart.js/auto';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit{
  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#660000',
                '#FBB117',
                '#6AA121',
                '#00008b',
                '#00ffff'
            ]
        }
    ],
    labels: []
};

  constructor(private data:DataService) { }

  ngAfterViewInit(): void {

    if (this.data.chartData == null)
    {
      this.data.loadData().subscribe((res:any) => {
        this.populateData();
      })
    }
    else
    {
      this.populateData();
    }
  }

  private populateData()
  {
      for (var i = 0; i < this.data.chartData.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = this.data.chartData.myBudget[i].budget as never;
        this.dataSource.labels[i] = this.data.chartData.myBudget[i].title as never;
      }
      this.createChart();
  }

  createChart() {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
}

}
