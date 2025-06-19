import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../../core/api/expense.service';
import { AuthService } from '../../../core/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { MatChip } from '@angular/material/chips';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  employeeEmail: string;
}

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatChip,
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['description', 'amount', 'category', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Expense>();
  isLoading = true;
  
  router: any;
  
  // Pagination
  pageSizeOptions = [5, 10, 25];
  pageSize = 5;
  

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExpenses(): void {
    this.isLoading = true;
    const currentUserEmail = this.authService.currentUser()?.email;

    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        // Filter by current user
        const filteredExpenses = expenses.filter(e => e.employeeEmail === currentUserEmail);
        
        // Initialize data source
        this.dataSource = new MatTableDataSource(filteredExpenses);
        
        // Set up sorting and pagination
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Set up custom sorting
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'amount': return item.amount;
            case 'date': return new Date(item.date).getTime();
            default: return item[property as keyof Expense];
          }
        };
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByStatus(status: string) {
    this.dataSource.filter = status.trim().toLowerCase();
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'approved': return 'success';
      case 'rejected': return 'warn';
      default: return 'primary';
    }
  }

  deleteExpense(id: string) {
    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(expense => expense.id !== id);
      },
      error: (err) => console.error('Failed to delete expense', err)
    });
  }

  goToDashboard() {
    this.router.navigate(['/employee/dashboard']); 
  }
}
