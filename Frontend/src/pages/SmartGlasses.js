import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Smartwatches.css";
import axios from "axios";
import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

function SmartGlasses(){
    const navigate=useNavigate();
    const [products, setProducts] = useState([]);
    const[search,setSearch]=useState("");
    const[count,setCount]=useState(0);
    const location = useLocation();
    const[qnty,setQnty]=useState(1);

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const query = params.get("search");
      const url = "http://localhost:3001/products/category/smartglasses";
      const finalUrl = query ? `${url}?search=${query}` : url;
      axios
        .get(finalUrl)
        .then((res) => {
          setProducts(res.data);
          setCount(res.data.length);
        })
        .catch((err) => console.log(err));
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  //add to cart 
  const addProduct = async (product) => {
      const user = JSON.parse(localStorage.getItem("user"));
    try {
      await fetch("http://localhost:3001/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: qnty,
          userId: user._id
        }),
      });
      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };


    return(
        <>
        <div className="watch-container">
        <div>
            <img src="/images/smartGlasses/sgimg.webp" alt="Smart Glasses" style={{width:"100%"}} />
        </div>
        <div>
            <p className="title"><b>Smart Glasses</b></p>
            </div>
            <div className="search-container">
                <input type="search" className="search" placeholder="search" value={search} onChange={handleSearch}/>            
            <div>Products:{count}</div>
        </div>
        <div className="grid-container">
            <div>
                <h6 style={{margin:"10px 0 0 0",fontSize:"24px"}}>Filter</h6>
                <div className="line"></div>
                <h6 style={{margin:"10px 0 0 0",fontSize:"24px"}}>Availability</h6>
                <div className="line"></div>
            </div>
            <div className="grid-item">
                <div className="best-grid">  
                {
                products.map((product) => (
                    <div key={product._id} className="indivual-product"  onClick={()=>navigate(`/ProductDisplay/${product._id}`)} >
                    <img src={`http://localhost:3001/uploads/${product.imageUpload}`} alt={product.title} style={{ width: "200px" }}/>
                    <h3>{product.title}</h3>
                    <p>Price: {product.price}</p>
                    <p>Rating: {product.rating}</p>
                    <button className="cart-btn" onClick={(e)=>{ e.stopPropagation();
                    addProduct(product)}}>Add to Cart</button>
                    </div>
                ))
                }
                </div>
            </div>
        </div>
        </div>
        </>

    );
}
export default SmartGlasses;
