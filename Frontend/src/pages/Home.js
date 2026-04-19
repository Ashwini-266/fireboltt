import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import ImageCarousel from "../components/ImageCarousel";
import axios from "axios";
import { useLocation } from "react-router-dom";


function Home() {
  const location = useLocation();
  const navigate=useNavigate();
  const [products, setProducts] = useState([]);
  const[count,setCount]=useState(1);
  
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const fetchdata = async () => {
      try {
        const url = search
          ? `https://fireboltt-backend.onrender.com/products?search=${search}`
          : `https://fireboltt-backend.onrender.com/products`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchdata();
  }, [location.search]);

  // Add to cart 
  const addProduct = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      try {
        await fetch("https://fireboltt-backend.onrender.com/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: count,
            userId: user._id,
          }),
        });
        alert("Added to cart");
      } catch (err) {
        console.error(err);
      }
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingItem = guestCart.find(
        (item) => item.productId._id === product._id
      );
      if (existingItem) {
        existingItem.quantity += count;
      } else {
        guestCart.push({
          productId: product,
          quantity: count,
        });
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      alert("Added to cart");
    }
  };


  return(
    <>
    <div className="home-container">
      <ImageCarousel />
      <div className="stats-section">
        <h2 className="stats-title">
          Fire-Boltt <span>| Ignite the fire in you</span>
        </h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon">📦</div>
            <div>
              <h3>50Mn+</h3>
              <p>UNITS SOLD</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">⭐</div>
            <div>
              <h3>05Mn+</h3>
              <p>PRODUCT REVIEWS</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">📈</div>
            <div>
              <h3>100% YOY</h3>
              <p>400% QOQ GROWTH</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">⏱️</div>
            <div>
              <h3>1 UNIT SOLD</h3>
              <p>EVERY 05 SEC</p>
            </div>
          </div>

        </div>
      </div>

      <div className="category">
        <div className="category-section">
          <h2>
            <span>Shop By Categories</span>
          </h2>
        </div>
        <div className="category-grid">
          {[
            { id: 1, name: "SmartWatches",  img: "/images/sw1.webp" , },
            { id: 2, name: "SmartAudio",  img: "/images/category/smartaudio.webp" },
            { id: 3, name: "SmartGlasses", img: "/images/sw3.webp" },
            { id: 4, name: "Accessories", img: "/images/sw5.webp" }
          ].map((item) => (
            <div key={item.id} className="category-card" onClick={() => navigate(`${item.name}`)}>
              <img className="category-img" src={item.img} alt={item.name}  />
              <button className="category-btn" >{item.name}</button>
            </div>
          ))}
        </div>
      </div>
    

      <div className="best-home-section">
        <div className="best-header">
          <h2>Best <span>Sellers</span></h2>
        </div>

        <div className="best-grid" >
          {
          products.map((product) => (
            <div className="indivual-product" key={product._id} onClick={()=>navigate(`/ProductDisplay/${product._id}`)}>
              
              <img src={product.imageUpload} alt={product.title} style={{ width: "200px" }}/>
              <h3>{product.title}</h3>
              <p>Price: {product.price}</p>
              <p>Rating: {product.rating}</p>
              <button className="home-cart" onClick={(e)=>{ 
                e.stopPropagation();
                addProduct(product)
            }}>
            Add to Cart</button>
            </div>
          ))
          }
        </div>
        <div className="view-all">
          <button onClick={()=>navigate("/allcollections")}>View All</button>
        </div>
      </div>

        <div>
            <img src="/images/home1.webp" alt="Smartwatches" style={{width:"100%"}} onClick={()=>navigate("/allcollections")} />
        </div>
        <div className="freshdrops">
          <h2>Fresh {}<span>Drops</span></h2>
        </div>
        <div>
            <img src="/images/home2.webp" alt="Smartwatches" style={{width:"100%"}} onClick={()=>navigate("/smartwatches")} />
          </div>
          <div>
              <h2 style={{marginTop:"3%"}}>Fire-Boltt Blogs</h2>
              <h2 style={{fontSize:"20px",marginBottom:"2%"}}>Guidance and motivation to ignite the fire in you</h2>
              <div className="Blogs-img">
                <div>
                  <img src="/images/homei1.webp" alt="Smartwatches"/>
                  <p style={{color:"black"}}>Best Smartwatch Faces:Customization, Features and Top Picks</p>
                </div>
                <div>
                  <img src="/images/homei2.webp" alt="Smartwatches"/>
                  <p style={{color:"black"}}>FireBoltt clickk-An Andriod Smartwatch with selfie Camera & More.</p>
                </div>
                <div>
                  <img src="/images/homei3.webp" alt="Smartwatches"/>
                  <p style={{color:"black"}}>Real-Life Scenarios: When Snapp Smartwatch’s Selfie Camera Comes in Handy</p>
                </div>
                <div>
                  <img src="/images/homei4.webp" alt="Smartwatches"/>
                  <p style={{color:"black"}}>Fire-Boltt Onyx- What to expect from the all-in-one smartwatch?</p>
                </div>
              </div>
            </div>
        </div>
    </>
    
  );
}

export default Home;
