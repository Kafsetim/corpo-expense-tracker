import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ExpenseService } from '../../../core/api/expense.service';
import { map, catchError, startWith, tap } from 'rxjs/operators';
import { of, Subject, switchMap } from 'rxjs';
import { HeaderComponent } from '../../shared/layout/header/header.component';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private expenseService = inject(ExpenseService);

  // Table configuration
  displayedColumns = ['date', 'description', 'amount', 'status'];
  loading = signal(true);
  error = signal<string | null>(null);

  // Refresh trigger
  private refreshTrigger = new Subject<void>();
  
  // Recent expenses observable with refresh capability
  recentExpenses$ = this.refreshTrigger.pipe(
    startWith(undefined), // Initial load
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap(() => this.expenseService.getExpenses().pipe(
      map(expenses => 
        expenses
          .filter(e => e.employeeEmail === this.authService.currentUser()?.email)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5) // Get 5 most recent
      ),
      catchError(err => {
        console.error('Failed to load expenses', err);
        this.error.set('Failed to load expenses. Please try again.');
        return of([]);
      }),
      tap(() => this.loading.set(false))
    )
  ));

  constructor() {
    // Initial load
    this.refreshExpenses();
  }

  // Manual refresh
  refreshExpenses() {
    this.refreshTrigger.next();
  }

  public get currentUserName(): string | undefined {
    return this.authService.currentUser()?.name;
  }

  // Status colors helper (for template)
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
