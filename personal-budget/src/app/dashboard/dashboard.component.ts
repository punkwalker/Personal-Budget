import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../data.service'
import { D3jschartComponent } from '../d3jschart/d3jschart.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { BudgetAndExpenseChartComponent } from '../budget-and-expense-chart/budget-and-expense-chart.component';
import { ExpenseChartComponent } from '../expense-chart/expense-chart.component';

@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements AfterViewInit {
  email: string = '';
  dbID = '';
  name: string = '';

  @ViewChild(D3jschartComponent) d3Chart ! : any;
  @ViewChild(BudgetAndExpenseChartComponent) budgetAndExpenseChart ! : any;
  @ViewChild(ExpenseChartComponent) expenseChart ! : any;
  budget: any;
  categories: any;
  startDate!: Date;
  lastLogin: any;
  expenses: any;

  selectedBudgetCategory:any;
  selectedBudget:any;
  selectedExpenseCategory:any;
  selectedExpense:any;
  totalExpenseForMonth:Number = 0;

  budgetForm = this.formBuilder.group({
    category: new FormControl(""),
    budget: new FormControl("")
  });

  customBudgetForm = this.formBuilder.group({
    category: new FormControl(""),
    budget: new FormControl("")
  });

  expenseForm = this.formBuilder.group({
    category: new FormControl(""),
    expense: new FormControl("")
  });

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  selectedMonth:string = "Jan";

  constructor(public auth: AuthService, public dataService:DataService, private router:Router, private formBuilder: FormBuilder){}

  ngAfterViewInit(): void {

    this.auth.user$.subscribe((user:any) => {
      this.email = user.email;
      // this.name = user.given_name;
      this.lastLogin = user.updated_at;

      this.dataService.getUserData(this.email).subscribe((res:any) => {
        if (res.length > 0) {
          this.dbID = res[0]._id;
          this.name = res[0].name;

          this.dataService.getAllCategories().subscribe((data:any) => {
            this.categories = data;
            this.dataService.getBudgetData(this.dbID).subscribe((data:any) => {

              if (data.length < 1){
                this.budget = [];
                this.categories.forEach((category:any) => {
                  this.budget.push({
                    title:category.title,
                    budget:category.defaultValue
                  });

                  this.dataService.saveBudgetDataForUser(this.dbID, this.budget).subscribe((res:any) => {
                    console.log(res);
                    this.budget = res[0].insertedObjects[0].budget;
                    this.router.navigate(['/dashboard']);
                  });
                });
              }
              else{
                this.budget = data[0].budget;
                this.selectedBudgetCategory = this.budget[0].title;
                this.selectedBudget = this.budget[0].budget;
              }
              this.d3Chart.renderChart(this.budget);
              this.budgetAndExpenseChart.renderData(this.dbID, 'Jan');
              this.expenseChart.renderData(this.dbID, 'Jan');

              this.dataService.getAllExpensesByMonthForUser(this.dbID, this.selectedMonth).subscribe((data:any) => {
                this.expenses = data;
                this.selectedExpenseCategory = this.expenses[0].category;
                this.selectedExpense = this.expenses[0].expense;
                this.expenses.forEach((expense:any) => {
                  this.totalExpenseForMonth += expense.expense;
                });
              });
            });
          });
        }
        else {
          this.router.navigate(['/profile']);
        }
      });
    });
  }

  public saveBudgetCategory():void{
    console.log('save was called');
    var idx = this.budget.findIndex((x:any) => x.title == this.selectedBudgetCategory);
    this.budget[idx].budget = parseInt(this.budgetForm.value.budget!);

    this.dataService.saveBudgetDataForUser(this.dbID, this.budget).subscribe((res:any) => {
      console.log(res);
      this.budget = res[0].insertedObjects[0].budget;
      this.router.navigate(['/dashboard']);
    });
  }

  public saveCustomBudgetCategory(): void{
    this.budget.push({title:this.customBudgetForm.value.category, budget: parseInt(this.customBudgetForm.value.budget!)});

    this.dataService.saveBudgetDataForUser(this.dbID, this.budget).subscribe((res:any) => {
      console.log(res);
      this.budget = res[0].insertedObjects[0].budget;
      this.router.navigate(['/dashboard']);
    });
  }

  public saveExpense(): void{
    console.log('In SaveExpense');
    this.dataService.saveExpenseDataForUser(this.dbID, this.selectedMonth, this.selectedExpenseCategory, parseInt(this.expenseForm.value.expense!)).subscribe((res:any) => {
      console.log(res);
      this.refreshExpensesForMonth();
    });
  }

  public onSelectionChange($event:any):void{
    var idx = this.budget.findIndex((x:any) => x.title == $event.value);
    this.selectedBudgetCategory = $event.value;
    this.selectedBudget = this.budget[idx].budget;
  }

  public onExpenseCategorySelectionChange($event:any):void{
    var idx = this.categories.findIndex((x:any) => x.title == $event.value);
    this.selectedExpenseCategory = $event.value;

    var expIdx = this.expenses.findIndex((x:any) => x.category == this.selectedExpenseCategory);
    if (expIdx > -1)
    {
      this.selectedExpense = this.expenses[expIdx].expense;
    }
    else{
      this.selectedExpense = 0;
    }

  }

  onMonthSelectionChange($event:any):void{
    console.log('Changed month to - '+$event.value);

    this.selectedMonth = $event.value;
    // this.dataService.getAllExpensesByMonthForUser(this.dbID, this.selectedMonth).subscribe((data:any) => {
    //   this.expenses = data;
    //   this.expenses.forEach((expense:any) => {
    //     this.totalExpenseForMonth += expense.expense;
    //   });
    // });

    // this.selectedMonth = $event.value;
    // this.budgetAndExpenseChart.updateData(this.dbID, this.selectedMonth);
    // this.expenseChart.updateData(this.dbID, this.selectedMonth);

    this.refreshExpensesForMonth();
  }

  private refreshExpensesForMonth():void{
    this.dataService.getAllExpensesByMonthForUser(this.dbID, this.selectedMonth).subscribe((data:any) => {
      this.expenses = data;
      this.expenses.forEach((expense:any) => {
        this.totalExpenseForMonth += expense.expense;
      });
    });
    this.budgetAndExpenseChart.updateData(this.dbID, this.selectedMonth);
    this.expenseChart.updateData(this.dbID, this.selectedMonth);
  }
}
