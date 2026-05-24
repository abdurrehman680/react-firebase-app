// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ToastProvider from './components/ToastProvider'
import Home from './pages/Home'
import CreateItem from './pages/CreateItem'
import ViewAllItems from './pages/ViewAllItems'
import ViewSingleItem from './pages/ViewSingleItem'
import EditItem from './pages/EditItem'

export default function App() {
  return (
    <ToastProvider>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/create"      element={<CreateItem />} />
        <Route path="/books"       element={<ViewAllItems />} />
        <Route path="/books/:id"   element={<ViewSingleItem />} />
        <Route path="/edit/:id"    element={<EditItem />} />
      </Routes>
    </ToastProvider>
  )
}
