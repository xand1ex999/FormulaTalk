import { useState } from 'react';
import registerPic from '../../assets/registerPic.jpg';
import { replace, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from "react-toastify";
import './AuthPage.css';
import api from '../../api.js';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [ mode, setMode ] = useState("signin"); 
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(mode === 'register' ? "/auth/register": "/auth/login",
        mode === "register" 
        ? { username, email, password }
        : { email, password }
      );
      // console.log("res.data ===>", res.data);
      const { token, user } = res.data;
      login(token)
      toast.success(
      mode === "register"
        ? `Welcome, ${user.username}! 🎉 Your account has been created.`
        : `Welcome back, ${user.username}! 👋`
      );
      navigate("/", {replace: true})
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again.");
      }
      toast.error(error.response?.data?.message || "Something went wrong, please try again.");
    }    
  }

  return (
    <>
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
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-btn"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <button type="submit" className="submit-btn">
              {mode === "signin" ? "Sign In" : "Register"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  );
}
