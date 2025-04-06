# Employee Management System (101413749_comp3133_assignment2)

A professional Employee Management System built with Angular, featuring authentication, CRUD operations, search functionality, and photo upload capabilities.

## Features

- User Authentication (Login/Signup/Logout)
- Welcome Dashboard with quick navigation
- Employee Management:
  - List all employees with search and filter options
  - Add new employees with photo upload
  - Edit employee details
  - View employee details
  - Delete employees
- Advanced Search by Department and Designation
- Responsive design for mobile and desktop

## Technologies Used

- Angular 16
- Angular Material UI Components
- RxJS for reactive programming
- GraphQL for API communication
- JWT for authentication

## Development Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd 101413749_comp3133_assignment2
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   ng serve
   ```

4. Open browser and navigate to `http://localhost:4200/`

## Production Build

To build the application for production:

```
ng build --configuration=production
```

The build artifacts will be stored in the `dist/101413749_comp3133_assignment2/browser` directory.

## Deployment

### Firebase Deployment

1. Install Firebase CLI if not already installed:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```
   firebase init
   ```

4. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Project Structure

- `src/app/components/` - All Angular components
- `src/app/services/` - Services for API communication
- `src/app/guards/` - Authentication guards
- `src/assets/` - Static assets like images

## API Endpoints

The application communicates with a GraphQL API for all operations. The endpoints are configured in the environment files.

## Author

- Student ID: 101413749
- Name: [Your Name]
- Course: COMP3133 Full Stack Development II
- Assignment 2

## License

This project is licensed under the MIT License.
