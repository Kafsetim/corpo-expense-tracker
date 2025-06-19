// src/app/core/auth/auth.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, tap } from 'rxjs';

type UserRole = 'employee' | 'manager';
type User = {
  email: string;
  role: UserRole;
  name: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Persistent user state using signals
  private readonly USER_KEY = 'expense_tracker_user';
  private internalUser = signal<User | null>(null);

  // Public read-only access to current user
  currentUser = computed(() => this.internalUser());

  // Debug all state changes
  private debugLog = effect(() => {
    console.log('AuthState:', this.internalUser());
  });

  private users: User[] = [
    { email: 'employee@test.com', role: 'employee', name: 'John Employee' },
    { email: 'manager@test.com', role: 'manager', name: 'Jane Manager' }
  ];

  constructor(private router: Router) {
    // Initialize from localStorage
    this.loadInitialState();
  }

  /*login(email: string, password: string): boolean {
    // In a real app, verify password. For demo, we just check email.
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      console.warn('Login failed: User not found');
      return false;
    }

    this.internalUser.set(user);
    this.persistUser(user);
    this.router.navigate([user.role]);
    return true;
  }*/

  login(email: string, password: string): Observable<boolean> {
    console.log('Attempting login with:', email); // Debug
    
    return of(this.checkCredentials(email)).pipe(
      tap(success => {
        console.log('Login success?', success); // Debug
        if (success) {
          const user = this.users.find(u => u.email === email)!;
          console.log('Found user:', user); // Debug
          this.internalUser.set(user);
          this.persistUser(user);
          console.log('Navigation triggered to:', user.role); // Debug
        }
      }),
      delay(200)
    );
  }

  private checkCredentials(email: string): boolean {
    return this.users.some(u => u.email === email);
  }

  logout(): void {
    this.internalUser.set(null);
    this.clearPersistedUser();
    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  // Private methods for state persistence
  private loadInitialState(): void {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson) as User;
        if (this.validateUser(user)) {
          this.internalUser.set(user);
        } else {
          this.clearPersistedUser();
        }
      }
    } catch (error) {
      console.error('Failed to load user from storage', error);
      this.clearPersistedUser();
    }
  }

  private persistUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearPersistedUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  private validateUser(user: any): user is User {
    return user && 
           typeof user.email === 'string' && 
           ['employee', 'manager'].includes(user.role);
  }
}
