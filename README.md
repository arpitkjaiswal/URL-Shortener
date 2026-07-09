# 🔗 URL Shortener

A modern full-stack URL shortening application built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**. It transforms long, complex URLs into short, shareable links through a clean and responsive interface.

## 📖 Description

URL Shortener is a fast and user-friendly web application that enables users to generate shortened URLs in seconds. It features a responsive UI, persistent link storage, and one-click copying for a seamless experience across desktop and mobile devices.

Whether you're sharing links on social media, in emails, or with friends, this application makes URLs shorter, cleaner, and easier to manage.

---

## ✨ Features

* 🔗 Shorten any valid URL instantly
* 📋 Copy shortened links with a single click
* 💾 Persistent storage using MongoDB
* 🔄 View previously shortened URLs even after refreshing the page
* 📱 Fully responsive design for mobile, tablet, and desktop
* ⚡ Fast and intuitive user experience
* ❌ Input validation with meaningful error messages
* 🎨 Clean, modern UI built with Tailwind CSS

---

## 🚀 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* HTML5
* JavaScript (ES6+)

### Backend

* Node.js
* Express.js

### Database

* MongoDB

---

## 📂 Project Structure

```text
url-shortener/
├── client/          # React frontend
├── server/          # Express backend
├── models/          # MongoDB models
├── routes/          # API routes
├── controllers/     # Business logic
├── middleware/      # Custom middleware
└── README.md
```

---

## 🎯 Key Highlights

* RESTful API architecture
* Responsive and accessible UI
* Secure backend validation
* Clean folder structure
* Scalable full-stack architecture
* Easy deployment and maintenance

---

## 🛠️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
BASE_URL=http://localhost:5000
```

### Start the application

Backend

```bash
npm run dev
```

Frontend

```bash
npm start
```

---

## 📸 Preview

> Add screenshots or GIFs of your application here.

---

## 🌐 Live Demo

**Live Website:** *(Coming Soon)*

---

## 📌 Future Improvements

* User authentication
* Custom short URLs
* QR Code generation
* URL analytics (click count, location, devices)
* Link expiration
* Password-protected links
* Dashboard for managing URLs
* Dark mode
* Rate limiting and spam protection

---

## 🤝 Contributing

Contributions are always welcome!

If you'd like to improve this project:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes clear commit messages.

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub!
