import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAndExpenseChartComponent } from './budget-and-expense-chart.component';

describe('BudgetAndExpenseChartComponent', () => {
  let component: BudgetAndExpenseChartComponent;
  let fixture: ComponentFixture<BudgetAndExpenseChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetAndExpenseChartComponent]
    });
    fixture = TestBed.createComponent(BudgetAndExpenseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
