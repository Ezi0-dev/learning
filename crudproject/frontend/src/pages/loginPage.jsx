import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../js/authContext';
import api from '../js/api';


export default function LoginPage() {
    const location = useLocation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState(location.state?.error || '')
    const { setAccessToken, setUser } = useAuth()
    const navigate = useNavigate()

    async function loginUser(e) {
      e.preventDefault();
      setError('')

      try {
        const response = await api.post('/login', { username, password, rememberMe })

        setAccessToken(response.accessToken)
        api.setToken(response.accessToken)
        setUser(response.user.username)

        navigate('/dashboard')

      } catch (err) {
        setError(err.respone?.data?.message || 'Login failed')
        console.log(err)
      }

      setUsername("");
      setPassword("");
    }

    return (
      <>
      {error && <div className="error">{error}</div>}
      <div className="component-container">
        <div className="login-container">
            <h1>Login</h1>

            <form id="loginForm" onSubmit={loginUser}>

            <input 
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input 
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <label className="remember-me-label" htmlFor="rememberMe">
                <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
            </label>

            <input type='submit' value="Login"/>
            </form>
        </div>
      </div>
      </>
    )
  }