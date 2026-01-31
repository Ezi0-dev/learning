import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../js/authContext';
import api from '../js/api';


export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { setAccessToken } = useAuth()

    async function loginUser(e) {
      e.preventDefault();

      console.log(username, password)

      try {
        const data = await api.login(username, password)

        setAccessToken(data.accessToken)

        localStorage.setItem('user', JSON.stringify(data.user))

      } catch (err) {
        console.log(err)
      }

      setUsername("");
      setPassword("");
    }

    return (
      <>
        <div className="login-container">
            <form id="loginForm" onSubmit={loginUser}>
            <input 
                type="text"
                id="username"
                placeholder="Userame"
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
            <input type='submit' value="Login"/>
            </form>
        </div>
      </>
    )
  }