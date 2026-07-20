# 🔗 SnapLink — Modern URL Shortener

A lightweight full-stack URL shortening app built with **Node.js**, **Express.js**, and **MongoDB**, serving a **Tailwind CSS** frontend. Paste a long link, get a short one instantly — with live click tracking and QR codes built in.

---

## 📖 Overview

SnapLink runs as a single Express server: it serves the frontend as static files and exposes the shortening/redirect API from the same app on the same port. There's no separate frontend dev server — clone it, install once, run once.

> Tagline from the app itself: **"Shorten Links. Track Performance."** — an elegant platform to convert clunky URLs into powerful, clean, trackable links with live click analytics.

---

## ✨ Features

- 🔗 Paste any long URL and shrink it into a short link
- 📋 One-click copy to clipboard (with a "Copied!" confirmation)
- 🔄 Redirect from the short link to the original destination
- 📊 Live click analytics — each shortened link tracks a visit count and timestamped visit history in MongoDB
- 🎯 Dynamic QR code generation for every shortened link, with a download option
- ⚙️ Configure a custom domain/IP to use when generating links
- 📂 "Your Shortened Links" list — view previously created links with their click counts and original URLs
- 🎨 Dark, modern responsive UI styled with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, Tailwind CSS, JavaScript — served as static files from `public/` |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose) |
| **QR Codes** | [goqr.me API](https://goqr.me/api/) |

---

## 📂 Project Structure

```text
url-shortener/
├── controllers/     # Request handlers / business logic
│   └── url.js
├── models/           # Mongoose schema for URL documents
│   └── url.js
├── routes/           # API route definitions
│   └── url.js
├── public/           # Static frontend, served directly by Express
│   ├── index.html
│   ├── style.css
│   └── app.js
├── connect.js         # MongoDB connection setup
├── index.js            # App entry point (starts the server)
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on the default port (`mongodb://127.0.0.1:27017`)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Make sure MongoDB is running

The app connects to `mongodb://127.0.0.1:27017/short-url` on startup. If your MongoDB runs elsewhere, update the connection string in `connect.js`.

### 4. Run the server

```bash
npm start
```

You'll see:

```
Server is running on port 8000
Connected to MongoDB
```

Open **http://localhost:8000** — the frontend, API, and redirects are all served from this one port.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/url` | Create a shortened URL |
| `GET` | `/:shortId` | Redirect to the original URL and log the visit |

---

## 🎯 Roadmap

- [ ] Custom short URL aliases (currently auto-generated)
- [ ] User authentication
- [ ] Link expiration
- [ ] Password-protected links
- [ ] Analytics breakdown by location/device (currently tracks visit count + timestamp only)
- [ ] Rate limiting and spam protection

---

## 🤝 Contributing

Contributions, suggestions, and feature requests are welcome. Feel free to fork the repository, open an issue, or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

