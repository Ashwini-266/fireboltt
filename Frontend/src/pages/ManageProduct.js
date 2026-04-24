
import React, { useEffect, useState } from 'react';
import "../css/Admin.css";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://fireboltt-backend.onrender.com/products/${id}`);
      alert("Product deleted successfully");

      setProducts(prev =>
        prev.filter(product => product._id !== id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterQuery = params.get("filter") || "";

    setFilter(filterQuery);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://fireboltt-backend.onrender.com/products`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [location.search]);
  const handleFilter = (e) => {
    const value = e.target.value;

    const params = new URLSearchParams();

    if (value) {
      params.set("filter", value);
    }

    navigate(`?${params.toString()}`);
  };


  const filteredProducts = products.filter((product) => {
    if (
      filter === "smartwatch" ||
      filter === "smartaudio" ||
      filter === "smartglasses" ||
      filter === "accessories"
    ) {
      return product.category.toLowerCase() === filter.toLowerCase();
    }

    if (filter === "Price < 500") return product.price < 500;
    if (filter === "Price > 1000") return product.price > 1000;

    if (filter === "Rating >= 4") return product.rating >= 4;
    if (filter === "Rating < 4") return product.rating < 4;

    return true;
  });

  return (
    <>
      <h2>Manage Product</h2>


      <div className='product-filters'>
        <input
          list="data"
          placeholder="Filter products..."
          value={filter}
          onChange={handleFilter}
        />

        <datalist id="data">
          <option value="smartwatch" />
          <option value="smartaudio" />
          <option value="smartglasses" />
          <option value="accessories" />
          <option value="Price < 500" />
          <option value="Price > 1000" />
          <option value="Rating >= 4" />
          <option value="Rating < 4" />
        </datalist>

        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          Back
        </button>
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
          {filteredProducts.map(product => (
            <tr key={product._id}>
              <td>
                <img
                  src={product.imageUpload}
                  alt={product.title}
                  style={{ width: "100px" }}
                />
              </td>
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.rating}</td>
              <td>
                <button onClick={() => navigate(`/EditProduct/${product._id}`)}>
                  Edit
                </button>
                <button onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ManageProduct;