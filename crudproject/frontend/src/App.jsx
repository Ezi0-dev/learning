import { useState } from 'react'
import './App.css'

function App() {
    const [isLogin, setIsLogin] = useState(false); // start with register

  return (
      <div>
        <div className="flex">
          <button onClick={() => setIsLogin(true)}>Login</button>
          <button onClick={() => setIsLogin(false)}>Register</button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    );
  }

  function RegisterForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
        <div className="flex">
        <form id="registerForm" onSubmit={registerUser}>
          <input 
            type="text"
            id="username"
            placeholder="Userame"
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
      </>
    )
  }

  function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function loginUser(e) {
      e.preventDefault();

      const userInfo = {
        username: username,
        password: password
      }

      console.log(userInfo)

      fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "Application/JSON",
        },
        body: JSON.stringify(userInfo)
      })

      setUsername("");
      setPassword("");
    }

    return (
      <>
        <div className="flex">
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

export default App
