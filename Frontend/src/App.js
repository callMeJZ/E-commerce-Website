import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";


import NavBar from "./components/Navbar";
import Footer from "./components/Footer";


import LandingPage from "./pages/LandingPage";
import Shop from "./pages/Shop";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Account from "./pages/Account";
import EditProfile from "./pages/EditProfile";
import CartPage from "./pages/CartPage";
import CheckoutAddress from "./pages/Checkout_Address";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import ProductDetails from "./pages/ProductDetails";
import ProductList from "./pages/ProductList";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyProfile from "./pages/MyProfile";
import TrackOrders from "./pages/TrackOrders";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import Users from "./admin/Users";
import "./admin/Admin.css";
import { addToWishlist, removeFromWishlist, getWishlist } from './utils/wishlistHelper';

function App() {
  
  const [favorites, setFavorites] = useState([]);

  // on app load (in App component) you may want to fetch saved wishlist:
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      getWishlist().then(items => {
        // API returns objects with product relation -> map to favorites array of product objects
        setFavorites(items.map(w => w.product));
      }).catch(()=>{/* ignore */});
    } else {
      // optionally restore from localStorage if you used it previously
      const raw = localStorage.getItem('favorites');
      if (raw) setFavorites(JSON.parse(raw));
    }
  }, []);

  const toggleFavorite = async (product) => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      // keep existing behavior (open login modal)
      setFavorites((prev) => prev.find(p=>p.id===product.id) ? prev.filter(p=>p.id!==product.id) : [...prev, product]);
      // set post-login callback if desired
      return;
    }

    const exists = favorites.some(p => p.id === product.id);
    try {
      if (exists) {
        await removeFromWishlist(product.id);
        setFavorites(prev => prev.filter(p => p.id !== product.id));
      } else {
        await addToWishlist(product.id);
        setFavorites(prev => [...prev, product]);
      }
    } catch (err) {
      console.error('Wishlist API error', err);
      // show user-facing error if desired
    }
  };

  
  const UserLayout = () => (
    <>
      <NavBar favoritesCount={favorites.length} />
      <div style={{ minHeight: "80vh" }}>
        <Outlet /> {}
      </div>
      <Footer />
    </>
  );

  return (
    <BrowserRouter>

      <Routes>
        
        {}
        <Route element={<UserLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/track-orders" element={<TrackOrders />} />


            {}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutAddress />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<div>Order Confirmation Page</div>} />

        {/* Routes Receiving Wishlist Props */}
        <Route
          path="/shop"
          element={
            <Shop
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
        <Route
          path="/shop/:id"
          element={
            <ProductDetails
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
         <Route
          path="/products" // Assuming you use ProductList
          element={
            <ProductList
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
         <Route
          path="/wishlist"
          element={
            <Wishlist
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
        {/* ... previous routes ... */}
        
        {/* Login and Signup Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Route>  {/* <--- ADD THIS LINE HERE to close UserLayout */}

      {/* Admin Routes (Now separate from User Layout) */}
      <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
      </Route>

    </Routes>
    
  </BrowserRouter>
);
}

export default App;