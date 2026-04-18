import React from 'react';
import "../css/Admin.css";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ManageProduct(){
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const location = useLocation();

   //delete function 
    const deleteProduct = async (id) => {
        window.confirm("Are you sure you want to delete this product?")
        {
        try {
        await axios.delete(`http://localhost:3001/products/${id}`);
        alert("Product deleted successfully");
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
    };

    //product details
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("search");

        const fetchProducts = async () => {
            try {
            const res = await axios.get(
                `http://localhost:3001/products?search=${query || ""}`
            );
            setProducts(res.data);
            } catch (error) {
            console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [location.search]);

    //search
    const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
        navigate(`?search=${value}`);
    } else {
        navigate("");
    }
    };

    

    return(
        <>
        <h2>Manage Product</h2>
        <div className='product-filters'>
            <input type="search" className="search" placeholder="search" value={search} onChange={handleSearch}/>
            <button className="back-button" onClick={() => navigate("/admin")}>Back</button>
        </div>
        
        <table className="table">
            <thead>
                <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Rating</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map(product => (
                        <tr key={product._id}>
                            <td>
                                <img src={`http://localhost:3001/uploads/${product.imageUpload}`} alt={product.title} style={{ width: "100px" }}/>
                            </td>
                            <td>{product.title}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.rating}</td>
                            <td>
                                <button onClick={()=>navigate(`/EditProduct/${product._id}`)}>Edit</button>
                                <button onClick={() => deleteProduct(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </>
    );

}
export default ManageProduct;
