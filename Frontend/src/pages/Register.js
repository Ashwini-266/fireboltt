import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";
import { useState } from "react";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showRequestOtp, setShowRequestOtp] = useState(false);
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Request OTP
  const requestOTP = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    try {
      await axios.post("http://localhost:3001/reqOTP", { email });
      alert("OTP sent to your email");
      setOtpEnabled(true);
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    try {
      await axios.post("http://localhost:3001/verifyOTP", {
        email,
        otp,
      });
      alert("OTP verified successfully");
      setOtpVerified(true);
    } catch (error) {
      alert("Invalid or expired OTP");
    }
  };

  // Register user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify your OTP before registering");
      return;
    }
    try {
      await axios.post("http://localhost:3001/register", {
        firstname,
        lastname,
        email,
        password,
      });
      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <p className="subtitle">Ignite the #fireinyou</p>

      <form className="register-form" onSubmit={handleSubmit}>
        <label>First Name</label>
        <input type="text" onChange={(e) => setFirstname(e.target.value)}required/>

        <label>Last Name</label>
        <input type="text" onChange={(e) => setLastname(e.target.value)}/>

        <label>Email</label>
        <input type="email" onFocus={() => setShowRequestOtp(true)} onChange={(e) => setEmail(e.target.value)}required/>
        {
        showRequestOtp && (
          <button type="button" className="otp-btn" onClick={requestOTP}>
            Request OTP
          </button>
        )}

        <label>Enter OTP</label>
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={!otpEnabled || otpVerified} required/>
        <button type="button" className="otp-btn" onClick={verifyOTP} disabled={!otpEnabled || otpVerified}>
          Verify OTP
        </button>

        <label>Password</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} required/>

        <button type="submit" className="create-btn" disabled={!otpVerified}>
          Create
        </button>
        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
