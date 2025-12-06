import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Quantity update function
  const updateQuantity = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = subtotal * 0.1;
    const finalTotal = subtotal - discount;
    return { subtotal, discount, finalTotal };
  };

  const totals = calculateTotals();

  return (
    <Container className="wishlist-container my-5">
      
      {}
      <div className="wishlist-header">
        <h1>Cart ({cartItems.length})</h1>
      </div>

      {}
      {cartItems.length === 0 ? (
        <Row>
          <Col className="text-center mt-4">

            <p className="text-muted">
              Your cart is empty. Add items by browsing the shop!
            </p>

            <Button
              variant="outline-secondary"
              onClick={() => navigate("/shop")}
            >
              Go Shopping
            </Button>

          </Col>
        </Row>
      ) : (
        <Row>
          {}
          <Col lg={8}>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <Row key={item.id} className="cart-item mb-4 pb-4">
                  <Col md={3}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>

                  <Col md={6} className="item-details">
                    <h4 className="item-name">{item.name}</h4>

                    <div className="quantity-control">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </Button>

                      <span className="quantity-value">{item.quantity}</span>

                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      variant="link"
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Col>

                  <Col md={3} className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Col>
                </Row>
              ))}
            </div>
          </Col>

          {}
          <Col lg={4}>
            <aside className="order-summary">
              <h3>Order Summary</h3>

              <div className="summary-line">
                <span>Price</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span>Discount</span>
                <span>− ${totals.discount.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <span>${totals.finalTotal.toFixed(2)}</span>
              </div>

              <Button
                variant="warning"
                className="w-100 checkout-btn mt-3"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </aside>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPage;
