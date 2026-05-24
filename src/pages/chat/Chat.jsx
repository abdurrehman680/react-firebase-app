// src/pages/chat/Chat.jsx
// Real-time user-to-user chat using Firestore onSnapshot
import { useEffect, useRef, useState } from 'react'
import {
  collection, getDocs, addDoc, query, orderBy,
  onSnapshot, serverTimestamp, where, or
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ToastProvider'

// Build a deterministic chat room ID from two UIDs
function roomId(uid1, uid2) {
  return [uid1, uid2].sort().join('_')
}

export default function Chat() {
  const { currentUser } = useAuth()
  const toast = useToast()

  const [users,      setUsers]      = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [messages,   setMessages]   = useState([])
  const [text,       setText]       = useState('')
  const [sending,    setSending]    = useState(false)
  const bottomRef = useRef(null)
  const unsubRef  = useRef(null)

  // Load all users except self
  useEffect(() => {
    async function loadUsers() {
      try {
        const snap = await getDocs(collection(db, 'users'))
        setUsers(snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.id !== currentUser.uid)
        )
      } catch (err) {
        toast('Could not load users.', 'error')
        console.error(err)
      }
    }
    loadUsers()
  }, [])  // eslint-disable-line

  // Subscribe to messages when activeUser changes
  useEffect(() => {
    if (unsubRef.current) unsubRef.current()   // unsubscribe previous
    if (!activeUser) { setMessages([]); return }

    const room = roomId(currentUser.uid, activeUser.id)
    const q    = query(
      collection(db, 'messages'),
      where('room', '==', room),
      orderBy('createdAt', 'asc')
    )

    unsubRef.current = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 50)
    })

    return () => unsubRef.current?.()
  }, [activeUser])  // eslint-disable-line

  async function sendMessage(e) {
    e.preventDefault()
    if (!text.trim() || !activeUser) return
    setSending(true)
    try {
      await addDoc(collection(db, 'messages'), {
        room:        roomId(currentUser.uid, activeUser.id),
        senderId:    currentUser.uid,
        senderName:  currentUser.displayName || currentUser.email,
        text:        text.trim(),
        createdAt:   serverTimestamp(),
      })
      setText('')
    } catch (err) {
      toast('Failed to send message.', 'error')
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  function formatTime(ts) {
    if (!ts?.toDate) return ''
    return ts.toDate().toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit' })
  }

  return (
    <div className="chat-layout">
      {/* Sidebar: user list */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <span>💬 Messages</span>
        </div>
        {users.length === 0 ? (
          <p style={{ padding:'1rem', fontSize:'0.85rem', color:'var(--text-muted)' }}>
            No other users yet.
          </p>
        ) : users.map(u => (
          <button
            key={u.id}
            className={`chat-user-btn ${activeUser?.id === u.id ? 'active' : ''}`}
            onClick={() => setActiveUser(u)}
          >
            <div className="chat-avatar">{(u.displayName || u.email || '?')[0].toUpperCase()}</div>
            <div>
              <div className="chat-user-name">{u.displayName || u.email}</div>
              <div className="chat-user-role">{u.role}</div>
            </div>
          </button>
        ))}
      </aside>

      {/* Main chat window */}
      <main className="chat-main">
        {!activeUser ? (
          <div className="chat-empty">
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>💬</div>
            <p>Select a user to start chatting</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-avatar">{(activeUser.displayName || activeUser.email || '?')[0].toUpperCase()}</div>
              <div>
                <div style={{ fontWeight:600 }}>{activeUser.displayName || activeUser.email}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{activeUser.role}</div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && (
                <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.88rem', marginTop:'2rem' }}>
                  No messages yet. Say hello! 👋
                </p>
              )}
              {messages.map(msg => {
                const isMine = msg.senderId === currentUser.uid
                return (
                  <div key={msg.id} className={`chat-msg ${isMine ? 'mine' : 'theirs'}`}>
                    <div className="chat-bubble">{msg.text}</div>
                    <div className="chat-time">{formatTime(msg.createdAt)}</div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <form className="chat-input-row" onSubmit={sendMessage}>
              <input
                className="chat-input"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={`Message ${activeUser.displayName || activeUser.email}…`}
                disabled={sending}
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()}>
                {sending ? '…' : '➤'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
