export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string | Date;
  employeeEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  rejectionReason?: string;
}

export interface ManagerExpense extends Expense {
  employeeName: string;
}
