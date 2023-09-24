import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public chartData: any = null;
  private observable: any = null;

  constructor(private http: HttpClient) {}

  public loadData(): any {
    if (this.observable == null) {
      this.observable = this.http.get('http://localhost:3000/budget');
      this.observable.subscribe((res: any) => {
        this.chartData = res;
      });
    }
    return this.observable;
  }
}
