import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitExpenseComponent } from './submit-expense.component';

describe('SubmitExpenseComponent', () => {
  let component: SubmitExpenseComponent;
  let fixture: ComponentFixture<SubmitExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
