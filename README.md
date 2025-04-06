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
   git clone https://github.com/Kashh99/_comp3133_assignment2.git
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

### Vercel Deployment

1. Install Vercel CLI if not already installed:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments:

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project" and import your GitHub repository
3. Configure the project settings (use the production output directory: `dist/101413749_comp3133_assignment2/browser`)
4. Deploy the project

## Project Structure

- `src/app/components/` - All Angular components
- `src/app/services/` - Services for API communication
- `src/app/guards/` - Authentication guards
- `src/assets/` - Static assets like images

## API Endpoints

The application communicates with a GraphQL API for all operations. The endpoints are configured in the environment files.

## Author

- Student ID: 101413749
- Name: Kashyap Mavani
- Course: COMP3133 Full Stack Development II
- Assignment 2

## License

This project is licensed under the MIT License.
