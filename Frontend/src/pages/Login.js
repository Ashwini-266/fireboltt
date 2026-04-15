import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import axios from 'axios';
import { useState } from "react";
import { useLocation } from "react-router-dom";


function Login() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate = useNavigate();
    const location = useLocation();

    
    const handleSubmit=(e)=>{
        e.preventDefault()
        axios.post('https://fireboltt-backend.onrender.com/login',{email,password})
        .then(result=>{
          console.log(result)
          if(result.data.status==="success"){
            localStorage.setItem("role",result.data.role);
            localStorage.setItem("user", JSON.stringify(result.data.user));
            if (result.data.role === "admin") {
              navigate("/admin");
            } else if (location.state?.from === "/payment") {
              navigate("/payment", {
                state: location.state?.paymentData,
              });
            } else {
              navigate("/");
            }
          }
        })
      .catch(err=>console.log(err))
    }


  return (
    <div className="login-container">
      <h2>Login</h2>
      <p className="subtitle">Ignite the #fireinyou</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <div className="password-row">
          <label>Password</label>
          <span className="forgot">Forgot?</span>
        </div>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button type="submit" className="signin-btn">Sign In</button>
        <p className="create-account">
          Don't have an account yet? <span onClick={()=>navigate("/Register")}>Create account</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
