# Racer Connect

Racer Connect is a capstone project for MSU CSC 530, designed to help students and organizations at Murray State University connect through events and student organizations. The platform provides tools for managing events, viewing student organizations, and more.

---

## Features

- **Event Management**: View upcoming events, filter by date, and explore event details.
- **Student Organizations**: Browse student organizations and their details.
- **Admin Tools**: Admins can upload CSV files to update the student organizations table.
- **OAuth Integration**: Secure login using Google OAuth.

---

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: SQLite3 (planned migration to Supabase)
- **Authentication**: Passport.js with Google OAuth 2.0
- **File Uploads**: Multer for handling CSV uploads
- **API Testing**: Postman (for testing endpoints)

---

## Dependencies

### Backend
- `express`: Web framework for Node.js
- `sqlite3`: SQLite database driver
- `cors`: Cross-Origin Resource Sharing middleware
- `express-session`: Session management
- `passport`: Authentication middleware
- `passport-google-oauth20`: Google OAuth 2.0 strategy
- `multer`: Middleware for handling file uploads
- `csv-parser`: CSV file parsing

### Frontend
- `react`: JavaScript library for building user interfaces
- `react-router-dom`: Routing for React applications
- `tailwindcss`: Utility-first CSS framework

---

## Running the Application

### Prerequisites
- Node.js installed on your system
- SQLite3 installed for database management

### Steps
1. **Start the Backend**:
   - Navigate to the `server` directory:
     ```bash
     cd server
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     node index.js
     ```
   - The server should output a message indicating it is running on `http://localhost:5000`.

2. **Start the Frontend**:
   - Open a new terminal and navigate to the [racer-connect](http://_vscodecontentref_/1) directory:
     ```bash
     cd racer-connect
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - Open a web browser and navigate to the provided link (e.g., `http://localhost:5173`).

---

## Planned Features

### 1. **Database Migration**
   - Migrate from SQLite3 to Supabase for better scalability and cloud-based database management.

### 2. **Improved Styling**
   - Enhance the UI/UX using TailwindCSS and custom components.
   - Add responsive design for mobile and tablet devices.

### 3. **Admin Tools**
   - Add more admin functionalities, such as:
     - Managing events directly from the dashboard.
     - Editing and deleting student organizations.
     - Viewing detailed analytics for events and organizations.

### 4. **Search and Filtering**
   - Implement advanced search and filtering options for events and organizations.

---

## API Endpoints

### Events
- `GET /api/Events`: Fetch all events.
- `GET /api/EventsPaginated?page={page}&limit={limit}&search={search}`: Fetch paginated events with optional search.

### Student Organizations
- `GET /api/StudentOrganizations`: Fetch all student organizations.
- `POST /api/UploadStudentOrganizations`: Upload a CSV file to update the student organizations table.

---

## Contact
- Jaxon Elwell: jelwell@murraystate.edu
- Logan Owens: bowens11@murraystate.edu
- Connor Wilson: cwilson80@murraystate.edu
