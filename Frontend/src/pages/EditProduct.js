import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Admin.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';


function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        title: "",
        imageUpload:"",
        description:"",
        category: "",
        price: "",
        quantity: "",
        rating: ""
    });

    
    useEffect(() => {
        axios.get(`http://localhost:3001/products/${id}`)
            .then(res=> {
                setProduct(res.data);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
            });
    }, [id]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append("title",product.title);
        formData.append("image",product.imageUpload);
        formData.append('description',product.description);
        formData.append("category",product.category);
        formData.append("price",product.price);
        formData.append("quantity",product.quantity);
        formData.append("rating",product.rating);
        await axios.put(`http://localhost:3001/products/${id}`,formData,{
            headers:{"Content-Type":"multipart/form-data"},
        });
        alert("product updated successfully");
        navigate("/manageproduct");
    }


  return (
    <div className="edit-container">
    <div className="add-product" style={{ width: "400px", margin: "50px auto" }}>
        <form onSubmit={handleSubmit} >
            <h3>Update Product </h3>
            <div style={{ marginBottom: "10px"}}>
              <label>Product Title</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="text" placeholder="Enter product title" value={product.title}  required />
            </div>
    
            <div style={{ marginBottom: "10px" }}>
              <label>Image Upload</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="file" placeholder="upload the file" onChange={(e) => setProduct({...product, imageUpload: e.target.files[0]})}/>
            </div>

             <div style={{ marginBottom: "10px"}}>
              <label>Product Description</label><br />
              <textarea style={{ marginBottom: "10px",width:"80%" }} placeholder="Enter product title"  onChange={(e) => setProduct({...product, description: e.target.value})} required />
            </div>
    
            <div style={{ marginBottom: "10px" }} >
              <label>Category</label><br></br>
              <select style={{ marginBottom: "10px",width:"80%" }} value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} required>
                <option value="">Select a category</option>
                <option value="smartwatch">Smartwatch</option>
                <option value="smartaudio">Smart Audio</option>
                <option value="smartglasses">Smart Glasses</option>
                <option value="fitnessband">Fitness Band</option>
              </select>
              </div>
    
            <div style={{ marginBottom: "10px" }}>
              <label>Price</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="number" placeholder="Enter price" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} required/>
            </div>
    
            <div style={{ marginBottom: "10px" }}>
              <label>Quantity</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="number" placeholder="Enter quantity" value={product.quantity} onChange={(e) => setProduct({...product, quantity: e.target.value})} required/>
            </div>
    
            <div style={{ marginBottom: "10px" }}>
              <label>Rating</label><br />
              <input style={{ marginBottom: "10px",width:"80%" }} type="number" placeholder="Enter rating" value={product.rating} onChange={(e) => setProduct({...product, rating: e.target.value})} required/>
            </div>
    

            <button type="submit">Update</button>
            <button style={{backgroundColor:"red"}} type="button" onClick={() => navigate("/manageproduct")}>Back</button>
          </form>
        </div>
        </div>
  )
}

export default EditProduct;
