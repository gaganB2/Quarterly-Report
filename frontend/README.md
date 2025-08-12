# Quarterly Report Portal

<p align="center">
  <img src="https://img.shields.io/badge/Django-4.2-092E20?logo=django" alt="Django"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/MUI-5-007FFF?logo=mui" alt="Material-UI"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" alt="Vite"/>
</p>

A professional-grade, full-stack web application designed to streamline and automate the academic quarterly reporting process for **Bhilai Institute of Technology, Durg**. This portal provides a secure, role-based system for faculty to submit data, HODs to oversee their departments, and administrators to manage the entire system and derive key analytics.

---

## ✨ Key Features

This project is built with a focus on security, scalability, and user experience, incorporating a range of industry-standard features.

### 👨‍💻 Core Functionality & User Management
* **Role-Based Access Control (RBAC):** Three distinct user roles (**Faculty**, **HOD**, **Admin**) with tailored permissions and dashboard views.
* **Dynamic Form System:** A highly scalable system that dynamically generates over 40 unique data submission forms from a central configuration, adhering to the DRY (Don't Repeat Yourself) principle.
* **Complete Admin Dashboard:** A dedicated UI for administrators to create, edit, deactivate, and manage all user accounts and departments.
* **Advanced Filtering:** A powerful filtering panel for administrators to sort and view submission data by academic session, department, or individual faculty member.

### 🛡️ Security & Onboarding
* **Secure User Onboarding:**
    * **Email Verification:** New users must verify their email via a secure, one-time link before their account is activated.
    * **Forced Password Change:** New users are required to change their temporary, admin-provided password on their first login.
* **Token-Based Authentication:** Secure JWT (JSON Web Token) authentication with automated token refresh for a seamless user session.
* **API Rate Limiting:** Protects the backend from brute-force and Denial-of-Service (DoS) attacks.
* **Data Deletion Protection:** Implements `on_delete=PROTECT` at the database level to prevent accidental mass deletion of report data.

### 🚀 User Experience (UX)
* **Responsive Design:** A modern, polished UI built with Material-UI that is fully responsive for desktop, tablet, and mobile devices.
* **Light & Dark Mode:** Full support for both light and dark themes.
* **Client-Side Validation:** Robust, real-time form validation provides instant user feedback and reduces invalid API requests.

---

## 🛠️ Technology Stack

This project uses a modern, decoupled (headless) architecture.

| Area                | Technology                                       |
| ------------------- | ------------------------------------------------ |
| **Backend** | Django, Django REST Framework                    |
| **Frontend** | React 18, Vite                                   |
| **Database** | PostgreSQL                                       |
| **UI Library** | Material-UI (MUI) v5                             |
| **Authentication** | Simple JWT (JSON Web Token)                      |
| **Routing** | React Router v6                                  |
| **API Communication** | Axios (with interceptors for token management)   |
| **Form Validation** | Yup                                              |

---

## 📂 Project Structure

The repository is organized into two main directories:

* `/backend`: Contains the Django REST Framework project, which serves the API.
* `/frontend`: Contains the React (Vite) single-page application, which consumes the API.

---

## 🌐 API Overview

The backend exposes a set of RESTful endpoints for managing data.

| Endpoint                  | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `/api/token/`             | Authenticate a user and receive JWT tokens.      |
| `/api/register/`          | (Admin) Create a new user.                       |
| `/api/admin/users/`       | (Admin) Manage all user accounts.                |
| `/api/admin/departments/` | (Admin) Manage academic departments.             |
| `/api/faculty/...`        | Endpoints for faculty to submit report data.     |
| `/api/analytics/...`      | Endpoints for aggregated analytics and charts.   |

---

## 🚀 Getting Started

To get the project running locally, you will need to set up the backend and frontend separately.

### **1. Backend Setup**
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv env
    source env/bin/activate  # On Windows: env\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up the environment file:**
    * Rename `.env.example` to `.env`.
    * Fill in your `SECRET_KEY`, database credentials, and email settings (`EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`).
5.  **Run database migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
6.  **Create a superuser:**
    ```bash
    python manage.py createsuperuser
    ```
7.  **Start the server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be running at `http://127.0.0.1:8000`.

### **2. Frontend Setup**
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be running at `http://localhost:5173`.

---

## 📈 Usage

The application has three user roles with different capabilities:

* **Faculty:** Can log in, view the submission dashboard, and add, edit, or delete their own report records.
* **HOD (Head of Department):** Has all the permissions of a Faculty member, but can also view all submissions from every user within their specific department.
* **Admin:** Has full access to the system. They can view all submissions from all departments and access the administrative dashboard to manage users and departments.

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

This project is licensed under the MIT License. See the `LICENSE` file for details.