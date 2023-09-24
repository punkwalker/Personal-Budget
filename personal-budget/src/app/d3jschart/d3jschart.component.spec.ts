import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3jschartComponent } from './d3jschart.component';

describe('D3jschartComponent', () => {
  let component: D3jschartComponent;
  let fixture: ComponentFixture<D3jschartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [D3jschartComponent]
    });
    fixture = TestBed.createComponent(D3jschartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
