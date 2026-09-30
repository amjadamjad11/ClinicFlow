\# ClinicFlow Authentication \& RBAC



\## Overview



ClinicFlow uses \*\*JWT-based authentication\*\* and \*\*Role-Based Access Control (RBAC)\*\* to protect API resources.



The authentication system is responsible for:



\- User registration

\- User login

\- Password hashing

\- JWT token generation

\- JWT token verification

\- Role-based authorization

\- Protected API routes



\---



\## Authentication Architecture



```text

Client

&#x20; │

&#x20; │ Register / Login

&#x20; ▼

Auth Routes

&#x20; │

&#x20; ▼

Auth Controller

&#x20; │

&#x20; ├── Validate input

&#x20; ├── Check user

&#x20; ├── Verify password

&#x20; └── Generate JWT

&#x20; │

&#x20; ▼

JWT Token

&#x20; │

&#x20; │ Authorization: Bearer <token>

&#x20; ▼

Auth Middleware

&#x20; │

&#x20; ├── Verify JWT

&#x20; └── Attach user information to request

&#x20; │

&#x20; ▼

Role Middleware

&#x20; │

&#x20; ├── Check user role

&#x20; └── Allow / deny access

&#x20; │

&#x20; ▼

Protected Controller

