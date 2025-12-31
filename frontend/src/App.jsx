import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { getAuthToken } from './api/http.js'
import { signin, signup, logout } from './api/auth.js'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import FilmDetail from './pages/FilmDetail'
import SearchPage from './pages/Search'
import MyList from './pages/MyList'
import Profile from './pages/Profile'
function App() {
  const [token, setAuth] = useState(getAuthToken())
  const [user, setUser] = useState(null)

  // Login Form State
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      try {
        const savedUser = localStorage.getItem('user_info')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (e) {
        console.error("Erreur lecture user_info", e)
        localStorage.removeItem('user_info')
      }
    }
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (isSignup) {
        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères")
          return
        }
        await signup({ username, email, password })
        alert("Compte créé ! Veuillez vous connecter.")
        setIsSignup(false)
      } else {
        // We use username state for both username and email field in login
        const data = await signin({ usernameOrEmail: username, password })
        if (data.accessToken) {
          setAuth(data.accessToken)
          const userInfo = { username: data.username || username, id: data.id, roles: data.roles }
          localStorage.setItem('user_info', JSON.stringify(userInfo))
          setUser(userInfo)
        }
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Une erreur est survenue')
    }
  }

  function handleLogout() {
    logout()
    setAuth(null)
    setUser(null)
    localStorage.removeItem('user_info')
  }

  if (!token || !user) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="logo-large">FILMLINK</div>
          <h2>{isSignup ? "S'inscrire" : "Se connecter"}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Username {isSignup ? '' : 'ou Email'}</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={isSignup ? "Nom d'utilisateur" : "Username ou Email"}
                required
              />
            </div>

            {isSignup && (
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
              </div>
            )}

            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="btn-primary-auth">
              {isSignup ? "Créer le compte" : "Se connecter"}
            </button>
          </form>
          <p className="toggle-auth">
            {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? " Se connecter" : " S'inscrire"}
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mylist" element={<MyList user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/films/:id" element={<FilmDetail user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
