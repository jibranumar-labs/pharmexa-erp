# 💊 Pharmexa ERP

### Modern Pharmacy Management, POS & Inventory System

Pharmexa ERP is a full-stack pharmacy management platform designed to simplify day-to-day pharmacy operations including sales, purchasing, medicine inventory, stock control, customers, suppliers, expenses, reporting, and business management.

Built with **Laravel, React, Inertia.js, MySQL, Tailwind CSS, and Vite**, Pharmexa combines a modern user interface with a structured backend for managing pharmacy workflows efficiently.

---

## ✨ Key Features

### 🛒 Point of Sale (POS)
- Fast pharmacy sales workflow
- Medicine search and selection
- Customer-based sales
- Dosage management
- Checkout and sale completion
- Printable thermal receipts
- Sale history and details

### 💊 Medicine & Inventory Management
- Medicine catalog management
- Categories and manufacturers
- Stock adjustments
- Stock movement history
- Expiry management
- Medicine import
- Barcode scanning
- Medicine label printing
- FEFO-based inventory handling
- Serialized inventory support

### 📦 Purchasing
- Purchase management
- Supplier-based purchasing
- Purchase item tracking
- Purchase returns
- Printable purchase documents

### 🔄 Sales Returns
- Process medicine returns
- Track returned items
- Maintain return history
- Printable return documents

### 👥 Customers & Suppliers
- Customer management
- Supplier management
- Customer sales history
- Supplier purchase records

### 💰 Finance & Expenses
- Expense tracking
- Daily cash records
- Profit & loss reporting
- Financial summaries

### 📊 Reports
- Sales reports
- Purchase reports
- Inventory reports
- Profit & loss reports
- Export and print support

### 🏥 Multi-Pharmacy Management
- Pharmacy profiles
- Pharmacy-specific inventory
- Pharmacy-specific sales and purchases
- Central platform management
- User roles and permissions

### 🔐 Authentication & User Management
- Secure authentication
- User registration and login
- Password management
- Role-based access control
- Team management
- Activity logs

### 🏷️ Barcode & Traceability
- Barcode label generation
- GS1-related medicine fields
- Serialized medicine tracking
- Traceability transactions
- Stock matching
- Transaction logs

### ⚙️ Pharmacy Settings
- Pharmacy branding
- Receipt configuration
- Pharmacy information
- Application settings

---

## 🛠️ Technology Stack

**Backend**
- Laravel
- PHP
- MySQL
- Eloquent ORM

**Frontend**
- React.js
- Inertia.js
- Tailwind CSS
- JavaScript

**Development & Build**
- Vite
- Composer
- NPM

---

## 🏗️ Application Architecture

Pharmexa uses Laravel for backend business logic, authentication, database operations, APIs and services while React provides the interactive user interface.

Inertia.js connects the Laravel backend with React, allowing the application to maintain a modern single-page application experience while using Laravel routing and controllers.

---

## 🔒 Security

Sensitive environment configuration is excluded from this repository.

The `.env` file, dependencies, local build files and other private/generated resources are ignored through `.gitignore`.

Use `.env.example` when configuring a local development environment.

---

## 🚀 Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/jibranumar-labs/pharmexa-erp.git
cd pharmexa-erp