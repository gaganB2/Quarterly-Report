# Quarterly Report Management System

<p align="center">
  <img src="frontend/public/assets/logo.png" alt="BIT-DURG Banner" width="400"/>
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

- [About The Project](#about-the-project)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Database Setup (First Time Only)](#1-database-setup-first-time-only)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [API Overview](#-api-overview)
- [User Roles & Usage](#-user-roles--usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## About The Project

This portal provides a secure, role-based system for faculty to submit academic and research data, for Heads of Department (HODs) to oversee departmental submissions, and for administrators to manage the entire system and derive key analytics. The application is built with a modern, decoupled architecture, featuring a Django REST Framework backend and a React (Vite) frontend.

---

## Key Features

This project incorporates a range of industry-standard features with a focus on security, scalability, and user experience.

-   **🔐 Role-Based Access Control (RBAC):** Four distinct user roles (**Faculty**, **HOD**, **Admin**, **Student**) with tailored permissions and dashboard views.
-   **📝 Dynamic Form System:** A highly scalable system that dynamically generates over 40 unique data submission forms from a central configuration, adhering to the DRY principle.
-   **📊 Bulk Data Management:** A template-driven **Excel import/export system** with intelligent validation to handle large datasets efficiently and safely.
-   **⚙️ Complete Admin Dashboard:** Dedicated UIs for administrators to perform full CRUD operations on user accounts and academic departments.
-   **🔍 Advanced Filtering & Search:** Powerful filtering panels for admins and faculty to sort submission data by academic session, department, or individual faculty member.
-   **🛡️ Secure User Onboarding:**
    -   **Email Verification:** New users must verify their email via a secure, one-time link before their account is activated.
    -   **Forced Password Change:** Staff users are required to change their admin-provided password on their first login.
-   **🔑 Secure Password Recovery:** A full self-service workflow for users to securely reset their forgotten passwords via email.
-   **⚡ Token-Based Authentication:** Secure JWT (JSON Web Token) authentication with automated silent token refresh for a seamless user session.
-   **🎨 Modern, Responsive UI:** A polished UI built with Material-UI that is fully responsive and supports both **light and dark modes**.
-   **📈 Analytics & Visualization:** A dedicated analytics dashboard for admins to view aggregated data with interactive charts.

---

## Technology Stack

| Area                   | Technology                                     |
| ---------------------- | ---------------------------------------------- |
| **Backend**            | Django, Django REST Framework                  |
| **Frontend**           | React 18, Vite                                 |
| **Database**           | PostgreSQL                                     |
| **UI Library**         | Material-UI (MUI) v5                           |
| **Authentication**     | Simple JWT (JSON Web Token)                    |
| **API Communication**  | Axios (with interceptors for token management) |
| **Form Management**    | React Hook Form, Yup, Zod                      |
| **Data Handling**      | OpenPyXL (Backend), File-Saver, React-Dropzone |
| **Data Visualization** | Recharts                                       |

---

## 🚀 Getting Started

To get the project running locally, you will need to set up the backend and frontend separately.

### Prerequisites

Make sure you have the following software installed on your machine:

  * **Git** for cloning the repository.
  * **Python** (3.8 or newer).
  * **Node.js** (v18 or newer) & **npm**.
  * **PostgreSQL** (v12 or newer).

### 1\. Database Setup (First Time Only)

Before running the backend, you must create the database and a dedicated user with the correct permissions in PostgreSQL.

1.  Open your terminal or command prompt and start the PostgreSQL interactive terminal (`psql`).
    ```bash
    psql -U postgres
    ```
    You will be prompted for the password for the `postgres` superuser, which you set during installation.

2.  Inside the `psql` shell (e.g., `postgres=#`), run the following SQL commands in order. **These must match the `DB_` values in your `.env` file.**

    ```sql
    -- 1. Create the database for the project.
    CREATE DATABASE qr_db;

    -- 2. Create a new user (role) for the application with a password.
    CREATE USER qr_user WITH PASSWORD 'qr_pass';

    -- 3. Connect to the new database to set internal permissions.
    \c qr_db

    -- 4. Grant all privileges on the 'public' schema to your new user.
    GRANT ALL ON SCHEMA public TO qr_user;

    -- 5. Grant future privileges on tables and sequences created by the superuser (for migrations).
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO qr_user;
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO qr_user;
    ```
    You should see `CREATE DATABASE`, `CREATE ROLE`, `You are now connected...`, `GRANT`, `ALTER DEFAULT PRIVILEGES` as output for each command.

3.  **Verify the setup (optional but recommended):**
    *   To list all databases, run: `\l` (You should see `qr_db` in the list).
    *   To list all users, run: `\du` (You should see `qr_user` in the list).

4.  Exit the `psql` shell by typing `\q` and pressing Enter.

### 2\. Backend Setup

Now, set up the Django API server.

```bash
# 1. Clone the repository and navigate to the backend directory
git clone <your-repository-url>
cd <repository-folder>/backend

# 2. Create and activate a virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# 3. Install dependencies
# On Windows, it's safer to run pip through the python executable
python -m pip install -r requirements.txt

# 4. Set up the environment file
# Create a file named .env and copy the contents from your provided .env file.

# 5. Run database migrations to create the tables
python manage.py migrate

# 6. Create a superuser to access the admin panel
python manage.py createsuperuser

# 7. Start the server
python manage.py runserver
```

The backend API will now be running at `http://127.0.0.1:8000`.

### 3\. Frontend Setup

In a **new terminal**, set up the React client.

```bash
# 1. Navigate to the frontend directory from the project root
cd <repository-folder>/frontend

# 2. Install dependencies
npm install

# 3. Set up the environment file
# Create a .env file and add the following line:
# VITE_API_BASE_URL=http://127.0.0.1:8000

# 4. Start the development server
npm run dev
```

The frontend application will now be running at `http://localhost:5173`.

---

## 🔑 Environment Variables

You must create a `.env` file in the `/backend` directory. Below is an example based on your provided file.

#### Backend (`/backend/.env`)


| Variable              | Description                                          | Your Value                    |
| --------------------- | ---------------------------------------------------- | ----------------------------- |
| `SECRET_KEY`          | A secret key for a Django installation.              | `$$*p8^...`                   |
| `DEBUG`               | Django debug mode. Should be `True` for local.       | `True`                        |
| `ALLOWED_HOSTS`       | Hosts/domains the Django app can serve.              | `.localhost, 127.0.0.1`       |
| `DB_NAME`             | Your PostgreSQL database name.                       | `qr_db`                       |
| `DB_USER`             | Your PostgreSQL username.                            | `qr_user`                     |
| `DB_PASSWORD`         | Your PostgreSQL password.                            | `qr_pass`                     |
| `DB_HOST`             | Database host.                                       | `localhost`                   |
| `DB_PORT`             | Database port.                                       | `5432`                        |
| `CORS_ALLOWED_ORIGINS`| The frontend URL for CORS.                           | `http://localhost:5173,...`   |
| `EMAIL_HOST_USER`     | Your Gmail address for sending verification emails.  | `gagannn.skyy@gmail.com`      |
| `EMAIL_HOST_PASSWORD` | Your 16-character Gmail App Password.                | `vbwuzzcnmbawcqow`            |

---

## 🧪 Running Tests

The backend includes a suite of tests to ensure the reliability of the user authentication and management system. These tests cover the user registration lifecycle and key administrative actions.

To run these tests, navigate to the `/backend` directory and run:

```bash
# Ensure your virtual environment is activated
python manage.py test
```

---

## 🌐 API Overview

The backend exposes a set of RESTful endpoints for managing data. The full, interactive documentation is available via Swagger UI when the local server is running.

| Endpoint                                 | Description                                               |
| ---------------------------------------- | --------------------------------------------------------- |
| `/api/token/`                            | Authenticate a user and receive JWT tokens.               |
| `/api/register/`                         | **(Admin)** Create a new staff/student user.              |
| `/api/student/register/`                 | **(Public)** Allows students to self-register.            |
| `/api/password-reset/request/`           | **(Public)** Request a password reset email.              |
| `/api/password-reset/confirm/`           | **(Public)** Confirm a password reset with a token.       |
| `/api/resend-verification/`              | **(Public)** Request a new account activation email.      |
| `/api/admin/users/`                      | **(Admin)** Manage all user accounts.                     |
| `/api/admin/departments/`                | **(Admin)** Manage academic departments.                  |
| `/api/data/{form}/`                      | Endpoints for CRUD on report data.                        |
| `/api/data/{form}/export-excel/`         | Export filtered data for a form to `.xlsx`.               |
| `/api/data/{form}/download-template/`    | Download a blank, validated template for a form.          |
| `/api/import/{model_name}/`              | **(User)** Upload a completed `.xlsx` template.           |
| `/api/analytics/department-submissions/` | **(Admin/HOD)** Get aggregated analytics data for charts. |

---

## 🧑‍🤝‍🧑 User Roles & Usage

The application has four user roles with different capabilities:

  * **Student:** Can log in, view their submission dashboard, and add, edit, or delete their own S-series report records.
  * **Faculty:** Can log in, view their submission dashboard, and add, edit, or delete their own T-series report records.
  * **HOD (Head of Department):** Has all the permissions of a Faculty member, but can also view all submissions from every user within their specific department.
  * **Admin:** Has full access to the system. They can view all submissions from all departments, manage users and departments, and access the `S1.1` form for result analysis.

---

## 🤝 Contributing

Contributions to this project are welcome. Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.