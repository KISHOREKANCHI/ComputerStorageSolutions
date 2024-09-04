import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductpageComponent } from './add-productpage.component';

describe('AddProductpageComponent', () => {
  let component: AddProductpageComponent;
  let fixture: ComponentFixture<AddProductpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductpageComponent]
    });
    fixture = TestBed.createComponent(AddProductpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
