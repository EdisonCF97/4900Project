SushiLin Online Ordering Website 

Sushi Lin is a responsive website prototype for Japanese takeout and dine-in orders. Users can browse the menu, select quantities, and add to the cart; the cart remains 
consistent across all pages and calculates prices in real time. It also supports subscriptions, reservations, contact forms, and a simulated login. Emphasizing a unified design 
language and ease of use, the website is suitable for classroom demonstrations.

Live Preview: https://edisoncf97.github.io/4900Project/

## 📖 Project Overview

Sushi Lin is an online ordering system for a Japanese restaurant. This was my **Graduation Project** for the CISC 4900 course at Brooklyn College. The goal was to build a production-ready website from scratch, without using any frontend frameworks, to demonstrate my proficiency in HTML/CSS/JavaScript and real-world problem-solving.

The system supports the full customer journey: browsing a categorized menu, adding items to a persistent cart, managing quantities, checking out with delivery/pickup options, and simulated payment through both credit card and PayPal.

---

## ✨ Key Features

### User-Facing
- **Menu Browsing** — Four categories with images, descriptions, and prices
- **Smart Cart** — Persistent across all pages via `localStorage`; automatic item merging; real-time subtotal/tax/total calculation
- **Authentication** — Login/Register with local storage simulation
- **Reservations** — Date/time/party size picker with validation
- **Newsletter** — Email subscription with instant feedback
- **Checkout** — Delivery or pickup selection; address fields toggle; credit card validation; PayPal sandbox integration

### Technical
- **Multi-page SPA-like experience** — cart state persists across all pages
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Design System** — Custom CSS variables for consistent theming
- **No Frameworks** — Pure HTML/CSS/JS, demonstrating core web fundamentals

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| Frontend | HTML, CSS, JavaScript |
| Styling | Custom design, Flexbox, Grid, CSS animations |
| State Management | `localStorage` for cart and user data |
| Payment | PayPal Sandbox SDK |
| Icons & Fonts | Font Awesome, Google Fonts |
| Hosting | GitHub Pages |
