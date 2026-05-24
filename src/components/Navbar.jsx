// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        📚 <span>Book</span>Shelf
      </NavLink>
      <ul className="navbar-links">
        <li><NavLink to="/"       end>Home</NavLink></li>
        <li><NavLink to="/books"     >All Books</NavLink></li>
        <li><NavLink to="/create"    >+ Add Book</NavLink></li>
      </ul>
    </nav>
  )
}
