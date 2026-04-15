import React from "react";
import "../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>FIRE-BOLTT</h3>
        <p>Follow Us</p>
        <p>Like us on Facebook</p>
        <p>Join us on Instagram</p>
        <p>Join us on Youtube</p>
      </div>

      <div className="footer-section">
        <h4>Our Products</h4>
        <p>Audio</p>
        <p>Smart Glasses</p>
      </div>

      <div className="footer-section">
        <h4>Smartwatch By Price</h4>
        <p>Under 1500</p>
        <p>Under 2000</p>
      </div>

      <div className="footer-section">
        <h4>Help Desk</h4>
        <p>Support</p>
        <p>Track Order</p>
        <p>Contact Us</p>
      </div>

      <div className="footer-section">
        <h4>Legal</h4>
        <p>Terms & Conditions</p>
        <p>Privacy Policy</p>
      </div>

      <div className="copyright">
        © 2026 Fireboltt.com. All Rights Reserved. | Site Map
      </div>
    </footer>
  );
}

export default Footer;
