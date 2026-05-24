# 📚 BookShelf — React + Firebase Full-Stack App

> Web Engineering Assignment 03 & 04 — BSCS Spring 2026, University of Lahore

## 🔗 Links
- **Live URL:** _Add your deployment URL here_
- **GitHub:** _This repository_

---

## 📋 Assignment Coverage

| Task | Description | Status |
|------|-------------|--------|
| 1 | SPA Routing with React Router DOM | ✅ |
| 2 | Full CRUD with Firebase Firestore + Dynamic Routes | ✅ |
| 3 | Firebase Authentication (Email/Password + Google) | ✅ |
| 4 | User Data in Firestore (no duplicates, with role) | ✅ |
| 5 | Role-Based Protected Routing (Admin / User) | ✅ |
| 6 | Secure CRUD (ownership + admin override) | ✅ |
| 7 | Real-Time Chat (Firestore onSnapshot) | ✅ |
| 8 | Admin Dashboard with analytics | ✅ |
| 9 | Deployment on Vercel / Firebase Hosting | ✅ |
| 10 | GitHub Repository with README | ✅ |

---

## 🛣️ Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page |
| `/login` | Public | Email/Password + Google Sign-In |
| `/signup` | Public | Email/Password + Google Sign-Up |
| `/forgot-password` | Public | Password reset email |
| `/dashboard` | Auth users | User dashboard + stats |
| `/admin` | Admin only | Full analytics + user management |
| `/books` | Auth users | All books (role-aware edit/delete) |
| `/books/:id` | Auth users | Single book (dynamic route) |
| `/create` | Auth users | Add new book |
| `/edit/:id` | Owner / Admin | Edit a book |
| `/chat` | Auth users | Real-time user-to-user chat |

---

## 🔐 Role-Based Access

- **User:** Can CRUD their own books only
- **Admin:** Can CRUD all books + manage all users + promote/demote roles
- **To make yourself admin:** In Firebase Console → Firestore → `users` collection → find your document → set `role` to `"admin"`

---

## ⚙️ Setup

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/react-firebase-crud.git
cd react-firebase-crud
npm install
```

### 2. Configure Firebase
1. [Firebase Console](https://console.firebase.google.com) → Create project → Add Web App
2. Enable **Firestore Database**
3. Enable **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
4. Paste config into `src/firebase/config.js`

### 3. Firestore Security Rules (paste in Firebase Console)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
    match /books/{bookId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.uid == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    match /messages/{msgId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Run
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

---

## 🗂️ Project Structure

```
src/
├── context/
│   └── AuthContext.jsx         # Auth state + role via onAuthStateChanged
├── firebase/
│   ├── config.js               # Firebase init (db, auth, googleProvider)
│   └── authService.js          # signUp, signIn, Google, logout, reset, delete
├── components/
│   ├── Navbar.jsx              # Auth-aware navigation
│   ├── ProtectedRoute.jsx      # Route guard (requireAuth, requireAdmin)
│   ├── ToastProvider.jsx       # Global toast notifications
│   └── StarRating.jsx          # StarDisplay + StarSelector
├── pages/
│   ├── auth/
│   │   ├── Login.jsx           # Email + Google sign-in
│   │   ├── Signup.jsx          # Email + Google sign-up
│   │   └── ForgotPassword.jsx  # Password reset
│   ├── admin/
│   │   └── AdminDashboard.jsx  # Admin-only: users + all books
│   ├── chat/
│   │   └── Chat.jsx            # Real-time Firestore chat
│   ├── Home.jsx
│   ├── UserDashboard.jsx       # Per-user stats + book list
│   ├── CreateItem.jsx          # Add book (stores uid)
│   ├── ViewAllItems.jsx        # All books (role-aware actions)
│   ├── ViewSingleItem.jsx      # /books/:id dynamic route
│   └── EditItem.jsx            # /edit/:id (ownership check)
├── App.jsx                     # All routes with ProtectedRoute guards
├── main.jsx                    # AuthProvider wraps whole app
└── index.css                   # Global styles
```

---

## 🛠️ Tech Stack
- **React 18** + Vite
- **React Router DOM v6** — SPA routing, dynamic routes, protected routes
- **Firebase Firestore** — CRUD + real-time chat (onSnapshot)
- **Firebase Authentication** — Email/Password, Google Sign-In
