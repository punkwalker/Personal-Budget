import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //apiUrl:string = `http://localhost:3000`;
  apiUrl:string = `http://149.28.231.88:3000`;
  public chartData: any = null;
  private observable: any = null;

  constructor(private http: HttpClient) {}

  public loadData(): any {
    if (this.observable == null) {
      this.observable = this.http.get(`${this.apiUrl}/budget`);
      this.observable.subscribe((res: any) => {
        this.chartData = res;
      });
    }
    return this.observable;
  }

  public getBudgetData(userObjectID:string): any
  {
    return this.http.get(`${this.apiUrl}/budget?userObjectID=${userObjectID}`);
  }

  public getUserData(userName:string): any
  {
    return this.http.get(`${this.apiUrl}/user?userName=${userName}`);
  }

  public saveUserData(name:string, userName:string, lastLogin:string): any
  {
    var userData = {
      name: name,
      lastLogin: lastLogin,
      userName: userName
    };

    return this.http.post(`${this.apiUrl}/user`, userData);
  }

  public getAllCategories(): any {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  public getAllExpensesByMonthForUser(userObjectID:string, month:string): any {
    return this.http.get(`${this.apiUrl}/expense?userObjectID=${userObjectID}&month=${month}`);
  }

  public saveBudgetDataForUser(userObjectID:string, budget:object): any{

    var budgetData = {
      userObjectID: userObjectID,
      budget: budget
    };
    return this.http.post(`${this.apiUrl}/budget`, budgetData);
  }

  public saveExpenseDataForUser(userObjectID:string, month:string, category:string, expense:Number): any{

    var expenseData = {
      userObjectId: userObjectID,
      month: month,
      category: category,
      expense: expense
    }
    return this.http.post(`${this.apiUrl}/expense`, expenseData);
  }
}
