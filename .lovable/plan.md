

# KUTTYBROTHERS Management System

## Overview
A comprehensive management system with an attractive login page and a dashboard with 6 functional modules. The app will support both dark and light themes with a modern, polished design.

## Pages & Features

### 1. Login Page
- Beautiful split-screen or centered card design with gradient background
- Brand logo "KUTTYBROTHERS" prominently displayed
- "Welcome Back!" heading with subtitle
- Email and password input fields with a "Login" button
- Footer with "© 2025 Hevinka", Privacy Policy & Terms links
- Visual-only authentication (navigates to dashboard on submit)
- Dark/light theme toggle available

### 2. Dashboard Page
- Welcome banner with "Welcome to KUTTYBROTHERS"
- Subtitle: "Choose a module to get started with your management system"
- 6 module cards in a responsive grid, each clickable to navigate to its module:
  - **Accounts** – Manage ledgers, balances, and transactions
  - **Employees** – Track employee records, payroll, and attendance
  - **Attendance** – Monitor and manage attendance records
  - **Invoices** – Create and manage client invoices
  - **Rentals** – Manage rental tools and details
  - **Settings** – Configure system preferences
- Footer with branding and links
- Dark/light theme toggle in header

### 3. Accounts Module
- Ledger list with add/edit/delete
- Balance overview with summary cards
- Transaction log with filtering by date and type
- Charts showing income vs expenses

### 4. Employees Module
- Employee directory with search and filters
- Add/edit employee profiles (name, role, contact, salary)
- Payroll summary table
- Basic attendance overview per employee

### 5. Attendance Module
- Calendar-based attendance view
- Mark attendance (present, absent, half-day)
- Attendance reports and summaries
- Filter by employee and date range

### 6. Invoices Module
- Create new invoice with line items, taxes, totals
- Invoice list with status (paid, pending, overdue)
- View/print invoice detail
- Basic filtering and search

### 7. Rentals Module
- Rental items catalog (tools, equipment)
- Add/edit rental items with rates
- Track rental status (available, rented, returned)
- Rental history log

### 8. Settings Module
- System preferences (theme toggle dark/light)
- User profile settings
- General configuration options

## Design & Theme
- Modern gradient backgrounds (blues, purples) for visual appeal
- Clean card-based UI with subtle shadows and hover animations
- Both dark and light mode with smooth toggle
- Consistent "KUTTYBROTHERS | © 2025 Hevinka" footer across all pages
- Responsive design for desktop and tablet

## Technical Approach
- All data stored in local state (no backend)
- React Router for navigation between modules
- Recharts for data visualization in Accounts module
- Shadcn UI components throughout
- Dark/light theme using next-themes

