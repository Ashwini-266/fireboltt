import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import GuestNav from "./components/GuestNav";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Smartwatches from "./pages/Smartwatches";
import SmartAudio from "./pages/SmartAudio";
import SmartGlasses from "./pages/SmartGlasses";
import Gifting from "./pages/Gifting";
import Admin from "./pages/Admin";
import ManageProduct from "./pages/ManageProduct";
import AddProduct from "./pages/AddProduct";
import ManageOrder from "./pages/ManageOrder";
import EditProduct from "./pages/EditProduct";
import ProductDisplay from "./pages/ProductDisplay";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Checkout from "./components/Checkout";
import AdminRoute from "./components/AdminRoute";
import AllCollections from "./pages/AllCollections";
import Accessories from "./pages/Accessories";
import Profile from "./components/Profile";
import 'bootstrap/dist/css/bootstrap.min.css';

function Layout() {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const hideHeaderFooter =
  location.pathname.startsWith("/payment") ||
  location.pathname.startsWith("/checkout");

  return (
    <>
      {!hideHeaderFooter && (role === "admin" ? <GuestNav /> : <Navbar />)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>}  />
        <Route path="/smartwatches" element={<Smartwatches />} />
        <Route path="/smartaudio" element={<SmartAudio />} />
        <Route path="/smartglasses" element={<SmartGlasses />} />
        <Route path="/gifting" element={<Gifting />} />
        <Route path="/manageproduct" element={<AdminRoute><ManageProduct /></AdminRoute>}  />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/manageorder" element={<AdminRoute><ManageOrder /></AdminRoute>}  />
        <Route path="/editproduct/:id" element={<EditProduct />} />
        <Route path="/ProductDisplay/:id" element={<ProductDisplay />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/allcollections" element={<AllCollections />}/>
        <Route path="/accessories" element={<Accessories />}/>
        <Route path="/profile" element={<Profile />} />
        
      </Routes>

      {!hideHeaderFooter && role !== "admin" && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
