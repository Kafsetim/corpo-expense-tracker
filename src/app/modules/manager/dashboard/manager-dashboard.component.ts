import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ExpenseService } from '../../../core/api/expense.service';
import { ManagerExpense } from '../../../core/models/expense.model';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manager-dashboard',
  imports: [
    HeaderComponent,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent {
  allExpenses = signal<ManagerExpense[]>([]);
  isLoading = signal(true);
  error = signal('');
  
  // separate column definitions
  pendingColumns = ['employeeName', 'description', 'amount', 'date', 'actions'];
  approvedColumns = ['employeeName', 'description', 'amount', 'date', 'status'];
  rejectedColumns = ['employeeName', 'description', 'amount', 'date', 'status', 'rejectionReason'];

  constructor(private expenseService: ExpenseService) {
    this.loadAllExpenses();
  }

  // load all expenses, both pending and approved
  loadAllExpenses() {
    this.isLoading.set(true);
    this.error.set('');
    
    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        // Sort with pending first
        this.allExpenses.set(expenses);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err || 'Failed to load expenses');
        this.isLoading.set(false);
      }
    });
  }

  getRejectedApproval(expense: ManagerExpense, isApproved: boolean) {
    return this.allExpenses().filter(e => e.status === 'rejected');
  }

  getRejectedExpenses(): ManagerExpense[] {
    return this.allExpenses().filter(e => e.status === 'rejected');
  }

  // handling approval and rejections
  updateApproval(expense: ManagerExpense, isApproved: boolean) {
    const statusUpdate = isApproved ? 'approved' : 'rejected';
    
    this.expenseService.updateExpenseStatus(expense.id, isApproved).subscribe({
      next: (updatedExpense) => {
        // For rejection, add a reason (you might want to make this configurable)
        if (!isApproved) {
          updatedExpense.rejectionReason = 'Manager rejected';
        }
        const updated = this.allExpenses().map(e => 
          e.id === updatedExpense.id ? updatedExpense : e
        );
        this.allExpenses.set(updated);
      },
      error: (err) => console.error('Update failed', err)
    });
  }

  getPendingExpenses(): ManagerExpense[] {
    return this.allExpenses().filter(e => e.status === 'pending');
  }

  getApprovedExpenses(): ManagerExpense[] {
    return this.allExpenses().filter(e => e.status === 'approved');
  }

  approveExpense(expense: ManagerExpense) {
    this.expenseService.updateExpenseStatus(expense.id, true).subscribe({
      next: (updatedExpense) => {
        const updated = this.allExpenses().map(e => 
          e.id === updatedExpense.id ? updatedExpense : e
        );
        this.allExpenses.set(updated);
      },
      error: (err) => console.error('Approval failed', err)
    });
  }

  rejectExpense(expense: ManagerExpense) {
    const rejectionReason = prompt('Please enter rejection reason:') || 'No reason provided';

    this.expenseService.updateExpenseStatus(expense.id, false).subscribe({
      next: (updatedExpense) => {
        updatedExpense.rejectionReason = rejectionReason;
        const updated = this.allExpenses().map(e => 
          e.id === updatedExpense.id ? updatedExpense : e
        );
        this.allExpenses.set(updated);
      },
      error: (err) => console.error('Rejection failed', err)
    });
  }
}
