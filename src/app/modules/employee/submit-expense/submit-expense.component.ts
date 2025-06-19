import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseService } from '../../../core/api/expense.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ExpenseForm {
  description: FormControl<string | null>;
  amount: FormControl<string | null>;
  category: FormControl<string | null>;
  date: FormControl<Date | null>;
  receipt: FormControl<File | null>;
}

@Component({
  selector: 'app-submit-expense',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './submit-expense.component.html',
  styleUrl: './submit-expense.component.scss'
})

export class SubmitExpenseComponent {
  private expenseService = inject(ExpenseService);
  private snackBar = inject(MatSnackBar);

  expenseForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    date: new FormControl(new Date(), [Validators.required])
  });

  onSubmit() {
    if (this.expenseForm.valid) {
      const expenseData = {
        ...this.expenseForm.value,
        employeeEmail: 'employee@test.com',
        status: 'pending',
        date: this.expenseForm.value.date?.toISOString()
      };

      this.expenseService.addExpense(expenseData).subscribe({
        next: () => {
          this.snackBar.open('Expense submitted', 'Close', { duration: 3000 });
          this.expenseForm.reset();
          this.expenseForm.patchValue({ date: new Date() });
        },
        error: (err) => {
          this.snackBar.open('Submission failed', 'Close', { duration: 5000 });
          console.error('Error: ', err);
        }
      });
    }
  }

  setMaxAmountError() {
    this.expenseForm.get('amount')?.setErrors({
      max: 'Maximum amount is €5000'
    });
  }

  formatAmountForDisplay(amount: number): string {
    return amount.toLocaleString('en-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  }
}
