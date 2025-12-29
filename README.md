# 🐾 Online Pet Shop

A responsive e-commerce website for pet products built with HTML, CSS, JavaScript, and PHP.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)

## 🌐 Live Demo

🔗 [https://pawparadise.kesug.com](https://pawparadise.kesug.com)

## ✨ Features

- 🛒 **Shopping Cart** - Add/remove products, quantity management
- ❤️ **Favorites** - Save products for later
- 🔐 **User Authentication** - Signup, login, logout with secure sessions
- 💳 **Checkout** - Credit card and Cash on Delivery options
- 🔍 **Search** - Find products quickly
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Mint Green Theme** - Beautiful, modern UI

## 🛠️ Technologies Used

### Frontend
- HTML5 (Semantic markup)
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+, DOM manipulation)
- jQuery (AJAX requests)

### Backend
- PHP 7+ (Server-side logic)
- MySQL (Database)
- PDO (Database connection)

### Concepts Applied
- Unobtrusive JavaScript
- Client-side & Server-side Validation
- AJAX/JSON communication
- Password hashing (bcrypt)
- Session management
- Responsive design

## 📁 Project Structure

```
pawparadise/
├── index.html          # Main HTML page
├── styles.css          # All CSS styles
├── script.js           # Frontend JavaScript
├── products.json       # Product data
├── config.example.php  # Database config template
├── signup.php          # User registration API
├── login.php           # User login API
├── logout.php          # User logout API
├── check_session.php   # Session verification
├── submit_order.php    # Order submission API
├── database.sql        # Database schema
└── README.md           # This file
```

## 🚀 Installation

### Prerequisites
- XAMPP, WAMP, or any PHP server
- MySQL database

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/salwa107/online-pet-shop.git
   ```

2. **Create the database**
   - Open phpMyAdmin
   - Create a new database named `pawparadise`
   - Import `database.sql`

3. **Configure database connection**
   - Copy `config.example.php` to `config.php`
   - Update the database credentials in `config.php`

4. **Run the project**
   - Place files in your server's web directory (e.g., `htdocs`)
   - Open `http://localhost/pawparadise` in your browser

## 📊 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(100) | User's name |
| email | VARCHAR(255) | User's email (unique) |
| password | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | Registration date |

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| user_id | INT | Foreign key to users |
| name | VARCHAR(100) | Shipping name |
| phone | VARCHAR(20) | Contact phone |
| address | VARCHAR(500) | Shipping address |
| total | DECIMAL(10,2) | Order total |
| payment_method | VARCHAR(20) | 'card' or 'cod' |
| created_at | TIMESTAMP | Order date |

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/signup.php` | POST | Register new user |
| `/login.php` | POST | User login |
| `/logout.php` | POST | User logout |
| `/check_session.php` | GET | Check login status |
| `/submit_order.php` | POST | Submit order |

## 👥 Team

| Name | GitHub |
|------|--------|
| **Salwa** | [@salwa107](https://github.com/salwa107) |
| **Sarah Ahmed** | [@Saror1206](https://github.com/Saror1206) |

- Course: CNC111 - Web Programming

## 📄 License

This project is for educational purposes.

