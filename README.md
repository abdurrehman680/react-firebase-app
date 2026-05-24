# 📚 BookShelf — React + Firebase CRUD App

> Web Engineering Assignment 03 — BSCS Spring 2026, University of Lahore

## 🔗 Links
- **Live URL:** _Add your deployment URL here_
- **GitHub:** _This repository_

---

## 📋 Assignment Tasks Covered

| Task | Description | Status |
|------|-------------|--------|
| Task 1 | SPA Routing with React Router DOM | ✅ |
| Task 2 | Full CRUD with Firebase Firestore + Dynamic Routes | ✅ |
| Task 3 | Deployment on Vercel/Firebase Hosting | ✅ |
| Task 4 | GitHub Repository with README | ✅ |

---

## 🛣️ Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero page with book count |
| `/books` | View All Items | Cards grid with all books |
| `/books/:id` | View Single Item | Dynamic route — single book detail |
| `/create` | Create Item | Form to add a new book |
| `/edit/:id` | Edit Item | Pre-filled form to update a book |

---

## 🔥 Firebase CRUD Operations

- **Create** — Add a book via form → stored in Firestore `books` collection
- **Read (All)** — Fetch all documents, rendered as cards
- **Read (Single)** — Fetch one document via dynamic route parameter `/:id`
- **Update** — Edit a book; form pre-filled with existing Firestore data
- **Delete** — Remove a document; UI updates immediately without page reload

---

## ⚙️ Setup & Run

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/react-firebase-crud.git
cd react-firebase-crud
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project → Add a **Web App**
3. Enable **Firestore Database** (Build → Firestore → Create)
4. Copy your config into `src/firebase/config.js`

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 🚀 Deployment

### Option A — Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Option B — Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # set dist as public folder, SPA: yes
npm run build
firebase deploy
```

---

## 🗂️ Project Structure

```
src/
├── firebase/
│   └── config.js          # Firebase init & Firestore export
├── components/
│   ├── Navbar.jsx          # Sticky navigation with NavLink
│   ├── ToastProvider.jsx   # Global toast notifications (Context API)
│   └── StarRating.jsx      # StarDisplay & StarSelector components
├── pages/
│   ├── Home.jsx            # Hero + live book count
│   ├── CreateItem.jsx      # Create form (Firestore addDoc)
│   ├── ViewAllItems.jsx    # All books + inline delete
│   ├── ViewSingleItem.jsx  # Single book via /books/:id
│   └── EditItem.jsx        # Edit form via /edit/:id (pre-filled)
├── App.jsx                 # Route configuration
├── main.jsx                # React entry point
└── index.css               # Global styles
```

---

## 🛠️ Tech Stack

- **React 18** + Vite
- **React Router DOM v6** — SPA routing, dynamic routes
- **Firebase Firestore** — NoSQL cloud database
- **CSS Variables** — Theme system, no external CSS framework
