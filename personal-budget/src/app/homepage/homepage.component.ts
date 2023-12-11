import { AfterViewInit, Component } from '@angular/core';
import {Chart} from 'chart.js/auto';
import { DataService } from '../data.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

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

  constructor(private dataService:DataService, public auth:AuthService, private router:Router) { }

  ngAfterViewInit(): void {

    if (this.dataService.chartData == null)
    {
      this.dataService.loadData().subscribe((res:any) => {
        this.populateData();
      });
    }
    else
    {
      this.populateData();
    }

    this.auth.isAuthenticated$.subscribe((res:any) => {
      console.log("Inside isAuthenticated subs");
      console.log(res);
      if (res == true)
      {
        this.auth.user$.subscribe((user:any) => {

          this.auth.getAccessTokenSilently().subscribe((res:any) => {
            console.log(res);
          })

        //this.router.navigate(['/dashboard']);
        this.dataService.getUserData(user.email).subscribe((res:any) => {
            if (res.length > 0) {
              this.router.navigate(['/dashboard']);
            }
            else {
              this.router.navigate(['/profile']);
            }
          });
        });
      }
    });
  }

  private populateData()
  {
      for (var i = 0; i < this.dataService.chartData.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = this.dataService.chartData.myBudget[i].budget as never;
        this.dataSource.labels[i] = this.dataService.chartData.myBudget[i].title as never;
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
