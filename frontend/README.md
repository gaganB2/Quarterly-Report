# Quarterly Report Portal for BIT Durg


<p align="center">
  <img src="\public\assets\logo.png" alt="BIT-DURG Banner" width="400"/>
</p>

<p align="center">
  A professional-grade, full-stack web application designed to streamline and automate the academic quarterly reporting process for the <strong>Bhilai Institute of Technology, Durg</strong>.
  <br />
  <br />
  <img src="https://img.shields.io/badge/Django-5.0-092E20?logo=django" alt="Django"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/MUI-5-007FFF?logo=mui" alt="Material-UI"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" alt="Vite"/>
</p>

## Table of Contents

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [API Overview](#-api-overview)
- [User Roles & Usage](#-user-roles--usage)
- [Contributing](#-contributing)
- [License](#-license)

-----

## About The Project

This portal provides a secure, role-based system for faculty to submit academic and research data, for Heads of Department (HODs) to oversee departmental submissions, and for administrators to manage the entire system and derive key analytics. The application is built with a modern, decoupled architecture, featuring a Django REST Framework backend and a React (Vite) frontend.

-----

## ✨ Key Features

This project incorporates a range of industry-standard features with a focus on security, scalability, and user experience.

  - **🔐 Role-Based Access Control (RBAC):** Three distinct user roles (**Faculty**, **HOD**, **Admin**) with tailored permissions and dashboard views.
  - **📝 Dynamic Form System:** A highly scalable system that dynamically generates over 40 unique data submission forms from a central configuration, adhering to the DRY principle.
  - **⚙️ Complete Admin Dashboard:** Dedicated UIs for administrators to perform full CRUD operations on user accounts and academic departments.
  - **🔍 Advanced Filtering & Search:** Powerful filtering panels for both faculty and admins to sort and view submission data by academic session, department, or individual faculty member.
  - **🛡️ Secure User Onboarding:**
      - **Email Verification:** New users must verify their email via a secure, one-time link before their account is activated.
      - **Forced Password Change:** Users are required to change their temporary, admin-provided password on their first login.
  - **🔑 Token-Based Authentication:** Secure JWT (JSON Web Token) authentication with automated silent token refresh for a seamless user session.
  - **🎨 Modern, Responsive UI:** A polished UI built with Material-UI that is fully responsive and supports both **light and dark modes**.
  - **📊 Analytics & Visualization:** A dedicated analytics dashboard for admins to view aggregated data with interactive charts.

-----

## 🛠️ Technology Stack

| Area                  | Technology                                     |
| --------------------- | ---------------------------------------------- |
| **Backend**           | Django, Django REST Framework                  |
| **Frontend**          | React 18, Vite                                 |
| **Database**          | PostgreSQL                                     |
| **UI Library**        | Material-UI (MUI) v5                           |
| **Authentication**    | Simple JWT (JSON Web Token)                    |
| **API Communication** | Axios (with interceptors for token management) |
| **Form Validation**   | Yup (Client-Side), DRF Validators (Server-Side)|
| **Data Visualization**| Recharts                                       |

-----

## 🚀 Getting Started

To get the project running locally, you will need to set up the backend and frontend separately.

### Prerequisites

Make sure you have the following software installed on your machine:

  * **Python** (3.8 or newer)
  * **Node.js** (v18 or newer) & **npm**
  * **PostgreSQL** (v12 or newer)

### 1\. Backend Setup

First, set up the Django API server.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up the environment file
# Rename .env.example to .env and fill in your details
cp .env.example .env

# 5. Run database migrations to create the tables
python manage.py makemigrations
python manage.py migrate

# 6. Create a superuser to access the admin panel and create other users
python manage.py createsuperuser

# 7. Start the server
python manage.py runserver
```

The backend API will now be running at `http://127.0.0.1:8000`.

### 2\. Frontend Setup

In a new terminal, set up the React client.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up the environment file (if needed, defaults are provided)
# Rename .env.example to .env
cp .env.example .env

# 4. Start the development server
npm run dev
```

The frontend application will now be running at `http://localhost:5173`.

-----

## 🔑 Environment Variables

You must create a `.env` file in the `/backend` directory. Below is a description of the required variables.

#### Backend (`/backend/.env`)


| Variable              | Description                                          | Example                       |
| --------------------- | ---------------------------------------------------- | ----------------------------- |
| `SECRET_KEY`          | A secret key for a Django installation.              | `'your-super-secret-key'`     |
| `DEBUG`               | Django debug mode. Set to `False` in production.     | `True`                        |
| `ALLOWED_HOSTS`       | Hosts/domains the Django app can serve.              | `127.0.0.1,localhost`         |
| `DB_NAME`             | Your PostgreSQL database name.                       | `quarterly_report_db`         |
| `DB_USER`             | Your PostgreSQL username.                            | `postgres`                    |
| `DB_PASSWORD`         | Your PostgreSQL password.                            | `db_password`                 |
| `DB_HOST`             | Database host.                                       | `localhost`                   |
| `DB_PORT`             | Database port.                                       | `5432`                        |
| `CORS_ALLOWED_ORIGINS`| The frontend URL for CORS.                           | `http://localhost:5173`       |
| `EMAIL_HOST_USER`     | Your Gmail address for sending verification emails.  | `your.email@gmail.com`        |
| `EMAIL_HOST_PASSWORD` | Your Gmail App Password (not your regular password). | `your_app_password`           |
-----

## 🧪 Running Tests

The backend includes a suite of tests to ensure the reliability of the user authentication and management system. To run these tests, navigate to the `/backend` directory and run:

```bash
# Ensure your virtual environment is activated
python manage.py test
```

-----

## 🌐 API Overview

The backend exposes a set of RESTful endpoints for managing data.

| Endpoint                  | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `/api/token/`             | Authenticate a user and receive JWT tokens.               |
| `/api/register/`          | **(Admin)** Create a new user.                            |
| `/api/admin/users/`       | **(Admin)** Manage all user accounts.                     |
| `/api/admin/departments/` | **(Admin)** Manage academic departments.                  |
| `/api/faculty/...`        | Endpoints for faculty to submit various report data.      |
| `/api/analytics/...`      | **(Admin)** Endpoints for aggregated analytics and charts.|

-----

## 🧑‍🤝‍🧑 User Roles & Usage

The application has three user roles with different capabilities:

  * **Faculty:** Can log in, view the submission dashboard, and add, edit, or delete their own report records.
  * **HOD (Head of Department):** Has all the permissions of a Faculty member, but can also view all submissions from every user within their specific department.
  * **Admin:** Has full access to the system. They can view all submissions from all departments and access the administrative dashboard to manage users and departments.

-----

## 🤝 Contributing

Contributions to this project are welcome. Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

-----

## 📄 License

This project is licensed under the MIT License.