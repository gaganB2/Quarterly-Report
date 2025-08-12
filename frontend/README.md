# 🎓 Quarterly Report Portal

<p align="center">
  <img src="https://img.shields.io/badge/Django-4.2-092E20?logo=django" alt="Django"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/MUI-5-007FFF?logo=mui" alt="Material-UI"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" alt="Vite"/>
</p>

> A modern, secure, and scalable full-stack web platform to automate the academic quarterly reporting process for **Bhilai Institute of Technology, Durg**.

---

## ✨ Features at a Glance

### 🔐 User & Access Management
- **Role-Based Access Control (RBAC)** – Three roles:
  - 👨‍🏫 **Faculty**
  - 🧑‍💼 **HOD**
  - 🛠️ **Admin**
- **Email Verification** for new users.
- **Mandatory Password Reset** on first login.
- **JWT Authentication** with token refresh support.
- **Rate Limiting** to prevent abuse and attacks.

### 📋 Reporting System
- 💡 **Dynamic Form Generator** – 40+ form types generated from a central config.
- 📂 **Department-Wise Oversight** for HODs.
- 🔍 **Advanced Filtering** – Filter reports by session, department, or user.

### 📊 Admin Control Panel
- 🧑‍💼 **Manage Users & Departments**
- 🛡️ **Data Deletion Protection** with `on_delete=PROTECT`
- 📈 **Analytics Endpoints** for visual insights

### 🌐 UX/UI
- 🖥️ **Material UI v5** Interface
- 🌓 **Light & Dark Mode**
- ⚡ **Fully Responsive Design**
- ✅ **Client-Side Validation** with **Yup**

---

## 🧰 Tech Stack

| Area              | Technology                             |
|-------------------|-----------------------------------------|
| **Backend**       | Django, Django REST Framework (DRF)     |
| **Frontend**      | React 18, Vite                          |
| **Database**      | PostgreSQL 14                           |
| **Auth**          | JWT (via Simple JWT)                    |
| **UI Framework**  | Material UI (MUI) v5                    |
| **API Calls**     | Axios (with interceptors)               |
| **Routing**       | React Router v6                         |
| **Form Validation**| Yup                                   |

---

## 🗂️ Repository Structure

```
/backend    → Django REST API
/frontend   → React SPA (Single Page Application)
```

---

## 🌐 API Overview

| Endpoint                      | Purpose                                      |
|-------------------------------|----------------------------------------------|
| `/api/token/`                 | Obtain access and refresh tokens             |
| `/api/register/`              | Register a new user (Admin only)             |
| `/api/admin/users/`           | Manage user accounts                         |
| `/api/admin/departments/`     | Manage academic departments                  |
| `/api/faculty/...`            | Faculty data submission endpoints            |
| `/api/analytics/...`          | Aggregated data & analytics                  |

---

## 🚀 Getting Started

> Follow the steps below to set up the development environment locally.

### 🔧 Backend (Django)

```bash
cd backend
python -m venv env
source env/bin/activate        # On Windows: env\Scripts\activate
pip install -r requirements.txt
```

1. Rename `.env.example` to `.env` and update:
   - `SECRET_KEY`
   - DB credentials
   - Email config (`EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`)

2. Run migrations and create superuser:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

> Backend is live at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 💻 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

> Frontend is live at: [http://localhost:5173](http://localhost:5173)

---

## 👥 User Roles & Permissions

| Role   | Permissions |
|--------|-------------|
| **Faculty** | Submit and manage personal report data |
| **HOD**     | Faculty rights + view all reports in department |
| **Admin**   | Full system control (users, departments, analytics) |

---

## 🤝 Contributing

We welcome contributions from the community. To get started:

```bash
# 1. Fork the repo
# 2. Create a new branch
git checkout -b feature/YourFeature

# 3. Make changes & commit
git commit -m "Add some feature"

# 4. Push and open a PR
git push origin feature/YourFeature
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for more details.

---

## 🙌 Acknowledgements

Developed for **Bhilai Institute of Technology, Durg**, to support and streamline internal academic processes with secure digital solutions.
