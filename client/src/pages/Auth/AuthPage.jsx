import { useState } from 'react';
import registerPic from '../../assets/registerPic.jpg'
import './AuthPage.css'
import axios from 'axios'

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e){
    e.preventDefault();
    try {
      if(mode === 'register'){
        setLoading("Loading...")
        await axios.post('/api/auth/register', { username, email, password });
      } else if(mode === 'signin'){
        setLoading("Loading...")
        await axios.post('/api/auth/login', { email, password });
      }
    } catch (error) {
      console.error(error)
      setError("Something went wrong, please try again.");
    }    
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className='register-login-text'>{mode === 'signin'? "SIGN IN" : "CREATE ACCOUNT"}</h1>
        <img src={registerPic} alt="logo" />
        <div className="auth-switch">
          <button 
            className={mode === "signin" ? "active" : ""} 
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button 
            className={mode === "register" ? "active" : ""} 
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}
            required
          />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            required
          />
          <button type="submit" className="submit-btn">
            {mode === "signin" ? "Sign In" : "Register"}
          </button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
