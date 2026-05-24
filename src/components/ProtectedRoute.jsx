// src/components/ProtectedRoute.jsx
// Wraps a route and redirects if user doesn't have required access
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Props:
 *  - requireAuth  (default true) → redirects to /login if not logged in
 *  - requireAdmin (default false) → redirects to /dashboard if not admin
 *  - redirectTo   (default '/login')
 */
export default function ProtectedRoute({
  children,
  requireAuth  = true,
  requireAdmin = false,
}) {
  const { currentUser, userRole } = useAuth()
  const location = useLocation()

  // Not logged in at all
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but not admin
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
