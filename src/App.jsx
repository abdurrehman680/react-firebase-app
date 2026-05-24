// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar          from './components/Navbar'
import ToastProvider   from './components/ToastProvider'
import ProtectedRoute  from './components/ProtectedRoute'

// Public pages
import Home            from './pages/Home'
import Login           from './pages/auth/Login'
import Signup          from './pages/auth/Signup'
import ForgotPassword  from './pages/auth/ForgotPassword'

// Protected pages
import UserDashboard   from './pages/UserDashboard'
import AdminDashboard  from './pages/admin/AdminDashboard'
import Chat            from './pages/chat/Chat'
import CreateItem      from './pages/CreateItem'
import ViewAllItems    from './pages/ViewAllItems'
import ViewSingleItem  from './pages/ViewSingleItem'
import EditItem        from './pages/EditItem'

export default function App() {
  return (
    <ToastProvider>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/signup"         element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected — any logged-in user */}
        <Route path="/dashboard" element={
          <ProtectedRoute><UserDashboard /></ProtectedRoute>
        }/>
        <Route path="/chat" element={
          <ProtectedRoute><Chat /></ProtectedRoute>
        }/>
        <Route path="/books" element={
          <ProtectedRoute><ViewAllItems /></ProtectedRoute>
        }/>
        <Route path="/books/:id" element={
          <ProtectedRoute><ViewSingleItem /></ProtectedRoute>
        }/>
        <Route path="/create" element={
          <ProtectedRoute><CreateItem /></ProtectedRoute>
        }/>
        <Route path="/edit/:id" element={
          <ProtectedRoute><EditItem /></ProtectedRoute>
        }/>

        {/* Protected — admin only */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
        }/>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}
