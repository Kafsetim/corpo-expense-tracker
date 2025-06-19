import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Expense, ManagerExpense } from '../models/expense.model';

interface ExpenseToManagerExpenseFn {
  (expense: Expense): ManagerExpense;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/expenses';

  createExpense(expense: Expense) {
    return this.http.post('/api/expenses', {
      ...expense,
      currency: 'EUR'
    });
  }

  getExpenses(): Observable<any[]> {
    console.log('Fetching from:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(data => console.log('API Response:', data)),
      catchError(error => {
        console.error('API Error:', error);
        return of([]); // Fallback empty array
      })
    );
  }

  addExpense(expense: any) {
    return this.http.post(this.apiUrl, expense);
  }

  deleteExpense(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPendingExpenses(): Observable<ManagerExpense[]> {
    return this.http.get<Expense[]>('http://localhost:3000/expenses?status=pending').pipe(
      map((expenses: Expense[]) => 
        expenses.map<ManagerExpense>((expense: Expense) => ({
          ...expense,
          employeeName: this.getEmployeeName(expense.employeeEmail)
        }))
      ),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to load expenses'));
      })
    );
  }

  private getEmployeeName(email: string): string {
    // Mock implementation - in real app you'd fetch from users
    const users = [
      { email: 'employee@test.com', name: 'John Employee' },
      { email: 'manager@test.com', name: 'Jake Manager' }
    ];
    return users.find(u => u.email === email)?.name || email;
  }

  private toManagerExpense(expense: Expense): ManagerExpense {
    return {
      ...expense,
      employeeName: this.getEmployeeName(expense.employeeEmail) || 'Unknown'
    };
  }

  // get all expenses, pending and approved
  getAllExpenses(): Observable<ManagerExpense[]> {
    return this.http.get<Expense[]>(this.apiUrl).pipe(
      map(expenses => expenses.map(expense => ({
        ...expense,
        employeeName: this.getEmployeeName(expense.employeeEmail)
      }))),
      catchError(error => {
        console.error('API error', error);
        return throwError(() => 'Failed to load expenses');
      })
    );
  }

  // update status and return the updated expense
  updateExpenseStatus(id: string, isApproved: boolean): Observable<ManagerExpense> {
    return this.http.patch<Expense>(
      `${this.apiUrl}/${id}`, 
      { status: isApproved ? 'approved' : 'rejected' }
    ).pipe(
      map(updatedExpense => ({
        ...updatedExpense,
        employeeName: this.getEmployeeName(updatedExpense.employeeEmail)
      }))
    );
  }
}
