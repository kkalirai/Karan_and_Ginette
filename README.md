Project Setup Instructions
Frontend Setup
Clone the Git Repository: Clone the repository to your local machine using your preferred Git client or terminal.
Install Dependencies: Navigate to the project directory and install the required packages.
Command: npm install
Configure Backend URL: Open the `.env` file in the frontend project folder. Update the backend API URL with the appropriate value, for example:
BACKEND_URL=http://localhost:3001
Start the Development Server: Run the following command to start the frontend server.
Command: npm run dev
Access the Application: Open your web browser and navigate to:
http://localhost:3000
Initial Admin Credentials: Use the following credentials to log in as an administrator.
Email: admin@yopmail.com
Password: Test@123
Note: Ensure the backend server is running before starting the frontend. If the backend is not active, the application will display a 'Fetch Error.'
Backend Setup
Clone the Git Repository: Clone the repository to your local machine using your preferred Git client or terminal.
Install Dependencies: Navigate to the backend project directory and install the required packages.
Command: npm install
Set Up the Database: Create a local database named `test-backend` using your database management tool (e.g., MySQL Workbench, phpMyAdmin, or terminal commands).
Seed the Database: Populate the database with initial data by running the following command.
Command: npm run seed
Start the Backend Server: Launch the backend server in development mode.
Command: npm run start:dev
Reminder: Always start the backend server before launching the frontend application to avoid connection errors.
