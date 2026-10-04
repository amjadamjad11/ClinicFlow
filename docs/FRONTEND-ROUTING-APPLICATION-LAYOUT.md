# Frontend Routing & Application Layout

## Version

**v1.2.0**

## Overview

v1.2.0 establishes the frontend routing and shared application layout for ClinicFlow.

The React frontend now supports multiple pages through React Router and provides a reusable navigation structure.

## Technologies

- React
- React Router DOM
- Vite
- JavaScript

## Routing

ClinicFlow currently supports the following routes:

| Route | Page | Purpose |
|---|---|---|
| `/` | HomePage | Public ClinicFlow landing page |
| `/login` | LoginPage | User authentication screen |
| `*` | NotFoundPage | Handles unknown routes |

## Application Layout

The `AppLayout` component provides the shared structure for application pages.

```text
App
└── BrowserRouter
    └── Routes
        └── AppLayout
            ├── Navbar
            └── Outlet
                ├── HomePage
                ├── LoginPage
                └── NotFoundPage