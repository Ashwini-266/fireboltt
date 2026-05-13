import React, { useState } from 'react';
import '../css/Contact.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Contact() {
    const navigation = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact`, formData);
      alert(response.data.message);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      navigation("/");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };
  
  return (
    <div className="contact-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Contact Us</h2>
        <input type="text" name="name" placeholder="Name" className="form-input" value={formData.name} onChange={handleChange} required/>
        <input type="text" name="email" placeholder="Email" className="form-input" value={formData.email} onChange={handleChange} required/>
        <textarea name="message" placeholder="Message" className="form-textarea" value={formData.message} onChange={handleChange} required></textarea>
        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
}

export default Contact;