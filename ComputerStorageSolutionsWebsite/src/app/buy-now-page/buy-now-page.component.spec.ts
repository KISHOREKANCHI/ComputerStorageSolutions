import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyNowPageComponent } from './buy-now-page.component';

describe('BuyNowPageComponent', () => {
  let component: BuyNowPageComponent;
  let fixture: ComponentFixture<BuyNowPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyNowPageComponent]
    });
    fixture = TestBed.createComponent(BuyNowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
