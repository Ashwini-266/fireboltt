import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Smartwatches.css";
import axios from "axios";
import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

function Smartwatches(){

    const navigate=useNavigate();
    const [products, setProducts] = useState([]);
    const[search,setSearch]=useState("");
    const[count,setCount]=useState(0);
    const location = useLocation();
    const[qnty,setQnty]=useState(1);
    const [price, setPrice] = useState("");

    
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
    const query = params.get("search");
    let url = "https://fireboltt-backend.onrender.com/products/category/smartwatch";
    const queryParams = [];
    if (query) queryParams.push(`search=${query}`);
    if (price) queryParams.push(`price=${price}`);

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    axios.get(url)
      .then((res) => {
        setProducts(res.data);
        setCount(res.data.length);
      })
      .catch((err) => console.log(err));
  }, [location.search, price]);

  //add to cart logic
  const addProduct = async (product) => {
      const user = JSON.parse(localStorage.getItem("user"));
    try {
      await fetch("https://fireboltt-backend.onrender.com/cart", {
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
            <img src="/images/swimg.webp" alt="Smartwatches" style={{width:"100%"}} />
        </div>
        <div>
            <p className="title"><b>Smart Watches</b></p>
        </div>
        <div className="search-container">
          <input type="search" className="search" placeholder="search" value={search} onChange={handleSearch}/>            
          <div>Products:{count}</div>
        </div>

        <div className="grid-container">
            <div>
                <h6 style={{margin:"10px 0 0 0",fontSize:"24px"}}>Filter</h6>
                <div className="line"></div>
                <h6 style={{margin:"10px 0 0 0",fontSize:"24px"}}>Price</h6>
                <label>
                  <input type="radio" name="price" value="1000"
                    onChange={(e)=>setPrice(e.target.value)} />
                  Under ₹1000
                </label>
                <label>
                  <input type="radio" name="price" value="2000"
                    onChange={(e)=>setPrice(e.target.value)} />
                  Under ₹2000
                </label>
                <label>
                  <input type="radio" name="price" value="5000"
                    onChange={(e)=>setPrice(e.target.value)} />
                  Under ₹5000
                </label>
                <label>
                  <input type="radio" name="price" value=""
                    onChange={()=>setPrice("")} />
                  All
                </label>
            </div>

            <div className="grid-item">
                <div className="best-grid">
                    {
                    products.map((product) => (
                      <div key={product._id} className="indivual-product"  onClick={()=>navigate(`/ProductDisplay/${product._id}`)} >
                        <img src={product.imageUpload} alt={product.title} style={{ width: "200px" }}/>
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
export default Smartwatches;
