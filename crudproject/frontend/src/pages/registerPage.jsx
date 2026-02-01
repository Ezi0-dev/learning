import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    function registerUser(e) {
      e.preventDefault();

      const userInfo = {
        username: username,
        email: email,
        password: password
      }

      console.log(userInfo)

      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON",
        },
        body: JSON.stringify(userInfo),
      })

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