import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { EmployeeService } from '../../services/employee.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    SearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  displayedColumns: string[] = ['photo', 'first_name', 'last_name', 'email', 'gender', 'department', 'designation', 'salary', 'actions'];
  loading = true;
  error = '';
  searchTerm = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees()
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.filteredEmployees = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load employees';
          this.loading = false;
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    if (!this.searchTerm) {
      this.filteredEmployees = this.employees;
      return;
    }
    
    this.filteredEmployees = this.employees.filter(employee => 
      employee.first_name.toLowerCase().includes(this.searchTerm) ||
      employee.last_name.toLowerCase().includes(this.searchTerm) ||
      employee.email.toLowerCase().includes(this.searchTerm) ||
      employee.department?.toLowerCase().includes(this.searchTerm) ||
      employee.designation?.toLowerCase().includes(this.searchTerm)
    );
  }

  onAdvancedSearch(filters: {department?: string, designation?: string}): void {
    if (!filters.department && !filters.designation) {
      this.filteredEmployees = this.employees;
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployees(filters.department, filters.designation)
      .subscribe({
        next: (data) => {
          this.filteredEmployees = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to search employees';
          this.loading = false;
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employees', id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.loading = true;
      this.employeeService.deleteEmployee(id)
        .subscribe({
          next: () => {
            this.loadEmployees();
            this.snackBar.open('Employee deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.error = 'Failed to delete employee';
            this.loading = false;
            this.snackBar.open(this.error, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }
}
