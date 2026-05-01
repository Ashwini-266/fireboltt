import React from "react";
import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Addproduct() {
  const navigate=useNavigate();
  const [title, setTitle] = useState("");
  const [imageUpload, setImageUpload] = useState("");
  const [description,setDescription]=useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rating, setRating] = useState("");
  const [gst, setGst] = useState("");
    
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageUpload);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('rating', rating);
    formData.append('gst', gst);
    axios.post(`${process.env.REACT_APP_API_URL}/products`,
      formData
    );
    alert("Product added successfully");
      navigate("/admin");
  };
    return (
      <>
        <div className="add-header" style={{position: "relative",marginTop: "20px",marginBottom: "10px",textAlign: "center"}}>
          <h2 style={{ margin: 0 }}>Add Products</h2>
          <button className="back-button" onClick={() => navigate("/admin")} style={{position: "absolute",right: "20px",top: "50%",transform: "translateY(-50%)"}}>
            Back
          </button>
        </div>
        <div className="add-product" style={{width: "400px",margin: "50px auto",padding: "25px",borderRadius: "12px",backgroundColor: "#f4f4f4",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <form onSubmit={handleSubmit} >
            <div style={{ marginBottom: "10px"}}>  
              <label>Product Title</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="text" placeholder="Enter product title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Image Upload</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="file" placeholder="upload the file" onChange={(e) => setImageUpload(e.target.files[0])} required />
            </div>
            <div style={{ marginBottom: "10px"}}>
              <label>Product Description</label><br />
              <textarea style={{ marginBottom: "10px",width:"80%" }} placeholder="Enter product title" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div style={{ marginBottom: "10px" }} >
              <label>Category</label><br></br>
              <select style={{ marginBottom: "10px",width:"80%" }} value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value=" ">Select a category</option>
                <option value="smartwatch">Smartwatch</option>
                <option value="smartaudio">Smart Audio</option>
                <option value="smartglasses">Smart Glasses</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Price</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required/>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Quantity</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="number" placeholder="Enter quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Rating</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="number" placeholder="Enter rating" value={rating} onChange={(e) => setRating(e.target.value)} required/>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>GST</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="number" placeholder="Enter GST" value={gst} onChange={(e) => setGst(e.target.value)} required/>
            </div>
            <button type="submit">Add Product</button>
          </form>
        </div>
        </>
      );
    }
    
export default Addproduct;
