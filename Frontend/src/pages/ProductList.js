import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard'; 
import '../styles/ProductList.css'; 

// API Config
const API_URL = "http://localhost:8083/api/products";
const IMAGE_BASE_URL = "http://localhost:8083";

const ProductList = ({ favorites: globalFavorites, onToggleFavorite: globalToggleFavorite }) => {
  // --- State Management ---
  const [products, setProducts] = useState([]); // Default to empty array, no hardcoded samples
  const [isLoading, setIsLoading] = useState(true);
  
  // Favorites Logic
  const [localFavorites, setLocalFavorites] = useState([]);
  const favorites = globalFavorites !== undefined ? globalFavorites : localFavorites;
  const setFavorites = globalFavorites !== undefined ? () => {} : setLocalFavorites; 

  const localToggleFavorite = (product) => { 
    const id = product.id;
    setFavorites((prev) =>
      prev.find(item => item.id === id) 
        ? prev.filter((item) => item.id !== id) 
        : [...prev, product] 
    );
  };
  const onToggleFavorite = globalToggleFavorite || localToggleFavorite;

  // Alert State
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");

  // Helper to format Image URLs (Same as in Shop.js)
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x400/FFF0E6/CCC?text=No+Image";
    if (path.startsWith("data:")) return path;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/assets")) return path; 
    return `${IMAGE_BASE_URL}${path}`;
  };

  // --- Fetch Products from DB ---
  useEffect(() => {
    setIsLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Map the image paths correctly before setting state
        const formattedData = data.map(p => ({
            ...p,
            image: getImageUrl(p.image)
        }));
        setProducts(formattedData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      });
  }, []);

  // Handler for Add to Cart
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product.name);
    setAlertProduct(product.name);
    setShowCartAlert(true);
    setTimeout(() => {
      setShowCartAlert(false);
    }, 3000);
  };

  return (
    <Container className="product-list-container my-5">
      {/* --- Floating Cart Alert --- */}
      <Alert 
        variant="success"
        show={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        dismissible
        className="cart-alert"
      >
        Added <strong>{alertProduct}</strong> to your cart!
      </Alert>
      
      <h2 className="text-center mb-4">Our Products</h2>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p>Loading products...</p>
        </div>
      ) : (
        <Row>
          {products.length > 0 ? (
            products.map(product => (
              <Col lg={3} md={4} sm={6} xs={12} key={product.id} className="mb-4 d-flex align-items-stretch"> 
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  isFavorite={favorites.some(fav => fav.id === product.id)} 
                  onToggleFavorite={onToggleFavorite} 
                />
              </Col>
            ))
          ) : (
            <Col><p className="text-center">No products found in the database.</p></Col> 
          )}
        </Row>
      )}
    </Container>
  );
};

export default ProductList;