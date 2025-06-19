import { ManagerExpense } from '../models/expense.model';

export function isManagerExpense(expense: any): expense is ManagerExpense {
  return expense && 
         typeof expense.id === 'string' && 
         typeof expense.employeeName === 'string'; // Now required at runtime
}
