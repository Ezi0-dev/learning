import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../js/api.js'

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    async function registerUser(e) {
      e.preventDefault();

      try {
        const response = await api.post('/register', { username, email, password })

        navigate('/login')
      } catch (err) {
        console.log(err)
      }

      setUsername("");
      setEmail("");
      setPassword("");
    }

    return (
      <>
      <div className="component-container">
        <div className="register-container">

            <h1>Register</h1>

            <form id="registerForm" onSubmit={registerUser}>
            <input 
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input 
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input 
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input type='submit' value="Register"/>
            </form>
        </div>
      </div>
      </>
    )
} 