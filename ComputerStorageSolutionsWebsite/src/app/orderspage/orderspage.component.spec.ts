import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderspageComponent } from './orderspage.component';

describe('OrderspageComponent', () => {
  let component: OrderspageComponent;
  let fixture: ComponentFixture<OrderspageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderspageComponent]
    });
    fixture = TestBed.createComponent(OrderspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
