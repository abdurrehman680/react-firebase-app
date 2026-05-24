// src/pages/CreateItem.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useToast } from '../components/ToastProvider'
import { StarSelector } from '../components/StarRating'

const GENRES = ['Fiction','Non-Fiction','Science Fiction','Fantasy','Mystery',
  'Thriller','Romance','Biography','History','Self-Help','Other']

const INITIAL = { title: '', author: '', genre: '', pages: '', rating: 3, review: '' }

export default function CreateItem() {
  const [form, setForm]     = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast    = useToast()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) {
      toast('Title and Author are required.', 'error')
      return
    }
    setLoading(true)
    try {
      await addDoc(collection(db, 'books'), {
        ...form,
        pages:     Number(form.pages) || 0,
        rating:    Number(form.rating),
        createdAt: serverTimestamp(),
      })
      toast('Book added successfully! 📚')
      navigate('/books')
    } catch (err) {
      toast(`Failed to add book: ${err.message}`, 'error')
      console.error("Firestore Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Add a Book</h1>
      <p className="page-subtitle">Record a book you've read or are reading.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" name="title" value={form.title}
              onChange={handleChange} placeholder="e.g. The Alchemist" required />
          </div>

          <div className="form-group">
            <label className="form-label">Author *</label>
            <input className="form-input" name="author" value={form.author}
              onChange={handleChange} placeholder="e.g. Paulo Coelho" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-select" name="genre" value={form.genre} onChange={handleChange}>
                <option value="">Select genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pages</label>
              <input className="form-input" name="pages" type="number" min="1"
                value={form.pages} onChange={handleChange} placeholder="e.g. 208" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Rating</label>
            <StarSelector value={form.rating} onChange={val => setForm(p => ({ ...p, rating: val }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Review / Notes</label>
            <textarea className="form-textarea" name="review" value={form.review}
              onChange={handleChange} placeholder="What did you think of this book?" />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : '✓ Save Book'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/books')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
