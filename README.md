
# 🔗 SnapLink — Modern URL Shortener

<div align="center">

A modern full-stack URL Shortener that transforms long URLs into clean, shareable links with lightning-fast redirection, QR code generation, and a beautiful responsive interface.

<p>
  <img src="https://img.shields.io/github/license/arpitkjaiswal/URL-Shortener?style=for-the-badge" />
  <img src="https://img.shields.io/github/stars/arpitkjaiswal/URL-Shortener?style=for-the-badge" />
  <img src="https://img.shields.io/github/forks/arpitkjaiswal/URL-Shortener?style=for-the-badge" />
</p>

⭐ **If you like this project, don't forget to leave a star!**

</div>

---

# 📖 About

SnapLink is a modern URL shortening platform built to make sharing links quick, simple, and efficient.

Instead of sharing long and cluttered URLs, users can generate compact links that redirect instantly to the original destination. The application also provides QR code generation, URL history, and an elegant user interface for a seamless experience.

The project follows a full-stack architecture with a responsive frontend, RESTful backend, and MongoDB for persistent storage.

---

# ✨ Features

- 🔗 Instantly shorten any valid URL
- 📋 Copy shortened links with one click
- 📷 Generate QR Codes automatically
- ⚡ Lightning-fast URL redirection
- 📱 Fully responsive design
- 🎨 Modern and intuitive UI
- 🗂️ View recently shortened URLs
- ❌ Smart URL validation
- 💾 Persistent database storage
- 🚀 Optimized for performance

---

# 📸 Preview

> **Add screenshots here**

| Home | Generated URL |
|------|---------------|
| ![](screenshots/home.png) | ![](screenshots/result.png) |

| QR Code | URL History |
|----------|-------------|
| ![](screenshots/qr.png) | ![](screenshots/history.png) |

---

# 🏗️ Architecture

```text
                User
                  │
                  ▼
          React Frontend
                  │
          REST API Requests
                  │
                  ▼
         Express.js Server
                  │
          Business Logic
                  │
                  ▼
              MongoDB
```

---

# 📂 Project Structure

```text
📦 URL-Shortener
│
├── 📂 client
│   ├── src
│   ├── public
│   └── package.json
│
├── 📂 server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── index.js
│
├── README.md
└── package.json
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/arpitkjaiswal/URL-Shortener.git

cd URL-Shortener
```

---

## Install Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file inside the **server** folder.

```env
MONGODB_URI=your_mongodb_connection_string

PORT=5000

BASE_URL=http://localhost:5000
```

---

## Run the Project

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm start
```

The application should now be running locally.

---

# 📡 API

## Create Short URL

### POST

```http
POST /api/url
```

### Request

```json
{
  "url": "https://example.com"
}
```

### Response

```json
{
  "shortId": "abc123"
}
```

---

# 🎯 Roadmap

- [ ] Custom aliases
- [ ] User authentication
- [ ] Advanced analytics
- [ ] Link expiration
- [ ] Password-protected URLs
- [ ] Browser extension
- [ ] Bulk URL shortening
- [ ] Public API
- [ ] Dark/Light mode
- [ ] Admin Dashboard

---

# 💡 Why I Built This

This project was developed to deepen my understanding of full-stack web development by building a production-style application from scratch.

While developing SnapLink, I gained hands-on experience with:

- Designing scalable backend APIs
- Building responsive user interfaces
- Database integration
- URL routing and redirection
- RESTful architecture
- Error handling and validation
- End-to-end application development

---

# 🤝 Contributing

Contributions are always welcome!

If you'd like to improve this project:

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push the branch

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

# 🌐 Live Demo

Frontend:

> Add your deployed frontend URL here

Backend:

> Add your backend API URL here

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Arpit Kumar Jaiswal**

🔗 GitHub  
https://github.com/arpitkjaiswal

💼 LinkedIn  
https://www.linkedin.com/in/YOUR-LINKEDIN/

---

<div align="center">

### ⭐ Star this repository if you found it useful!

Made with ❤️ by **Arpit Kumar Jaiswal**

</div>
