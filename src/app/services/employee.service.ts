import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://ems-backend-96g7.onrender.com/graphql';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getEmployees(): Observable<any[]> {
    const headers = this.getHeaders();
    const graphqlQuery = {
      query: `
        query {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `
    };

    return this.http.post(this.apiUrl, graphqlQuery, { headers }).pipe(
      map((response: any) => {
        if (response.data?.getAllEmployees) {
          return response.data.getAllEmployees;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Failed to fetch employees');
        }
        return [];
      })
    );
  }

  getEmployee(id: string): Observable<any> {
    const headers = this.getHeaders();
    const graphqlQuery = {
      query: `
        query($id: ID!) {
          getEmployeeById(id: $id) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `,
      variables: { id }
    };

    return this.http.post(this.apiUrl, graphqlQuery, { headers }).pipe(
      map((response: any) => {
        if (response.data?.getEmployeeById) {
          return response.data.getEmployeeById;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Failed to fetch employee');
        }
        return null;
      })
    );
  }

  addEmployee(employee: any): Observable<any> {
    const headers = this.getHeaders();
    const graphqlQuery = {
      query: `
        mutation(
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String,
          $designation: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $department: String!,
          $employee_photo: String
        ) {
          addEmployee(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo: $employee_photo
          ) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `,
      variables: {
        first_name: employee.first_name || employee.firstName,
        last_name: employee.last_name || employee.lastName,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation || employee.position || '',
        salary: parseFloat(employee.salary),
        date_of_joining: employee.date_of_joining || new Date().toISOString(),
        department: employee.department || '',
        employee_photo: employee.employee_photo || ''
      }
    };

    return this.http.post(this.apiUrl, graphqlQuery, { headers }).pipe(
      map((response: any) => {
        if (response.data?.addEmployee) {
          return response.data.addEmployee;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Failed to add employee');
        }
        return null;
      })
    );
  }

  updateEmployee(id: string, employee: any): Observable<any> {
    const headers = this.getHeaders();
    const graphqlQuery = {
      query: `
        mutation(
          $id: ID!,
          $first_name: String,
          $last_name: String,
          $email: String,
          $gender: String,
          $designation: String,
          $salary: Float,
          $date_of_joining: String,
          $department: String,
          $employee_photo: String
        ) {
          updateEmployeeById(
            id: $id,
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo: $employee_photo
          ) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `,
      variables: {
        id,
        first_name: employee.first_name || employee.firstName,
        last_name: employee.last_name || employee.lastName,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation || employee.position,
        salary: employee.salary ? parseFloat(employee.salary) : undefined,
        date_of_joining: employee.date_of_joining,
        department: employee.department,
        employee_photo: employee.employee_photo
      }
    };

    return this.http.post(this.apiUrl, graphqlQuery, { headers }).pipe(
      map((response: any) => {
        if (response.data?.updateEmployeeById) {
          return response.data.updateEmployeeById;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Failed to update employee');
        }
        return null;
      })
    );
  }

  deleteEmployee(id: string): Observable<any> {
    const headers = this.getHeaders();
    const graphqlQuery = {
      query: `
        mutation($id: ID!) {
          deleteEmployeeById(id: $id)
        }
      `,
      variables: { id }
    };

    return this.http.post(this.apiUrl, graphqlQuery, { headers }).pipe(
      map((response: any) => {
        if (response.data?.deleteEmployeeById) {
          return response.data.deleteEmployeeById;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Failed to delete employee');
        }
        return null;
      })
    );
  }

  searchEmployees(department?: string, designation?: string): Observable<any[]> {
    const headers = this.getHeaders();
    const graphqlQuery = {
      query: `
        query($department: String, $designation: String) {
          searchEmployeeByDeptDesg(department: $department, designation: $designation) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `,
      variables: {
        department,
        designation
      }
    };

    return this.http.post(this.apiUrl, graphqlQuery, { headers }).pipe(
      map((response: any) => {
        if (response.data?.searchEmployeeByDeptDesg) {
          return response.data.searchEmployeeByDeptDesg;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Failed to search employees');
        }
        return [];
      })
    );
  }
}
