import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import productsData from "./products.json";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);


function Main() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("browse");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    creditcard: "",
    address: "",
  });


  useEffect(() => {
    setProducts(productsData);
  }, []);

  const addToCart = (product, quantity) => {
    const existingProduct = cart.find((p) => p.id === product.id);
    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;
      if (newQuantity > 0) {
        setCart(
          cart.map((p) =>
            p.id === product.id ? { ...p, quantity: newQuantity } : p
          )
        );
      } else {
        setCart(cart.filter((p) => p.id !== product.id));
      }
    } else if (quantity > 0) {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const getItemQuantity = (product) => {
    const item = cart.find((p) => p.id === product.id);
    return item ? item.quantity : 0;
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    const tax = subtotal * 0.07;
    return subtotal + tax;
  };

  const removeFromCart = (product) => {
    const existingProduct = cart.find((p) => p.id === product.id);
    if (existingProduct) {
      setCart(cart.filter((p) => p.id !== product.id));
    }
  };

  const confirmationPageGo = (event) => {

    setUserDetails({
      name: event.target.name.value,
      email: event.target.email.value,
      creditcard: event.target.creditCard.value,
      address: event.target.address.value,
    });

    changeView("confirmation");

  };

  const leaveConfirmation = () => {
    setCart([]);
    changeView("browse");
  };



  const changeView = (newView) => {
    setView(newView);
  };

  return (
    <div className="Main">
      {view === "browse" && (
        <div>
          <h1>Browse Products</h1>
          <div className="products">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <h2>{product.name}</h2>
                <p>Price: ${product.price}</p>
                <div>
                  <button onClick={() => addToCart(product, 1)}>+</button>
                  <span>{getItemQuantity(product)}</span>
                  <button onClick={() => addToCart(product, -1)}>-</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => changeView("cart")}>Go to cart</button>
        </div>
      )}

      {view === "cart" && (
        <div>
          <h1>Cart</h1>
          <div className="cart-items">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <h2>{product.name}</h2>
                <p>Quantity: {product.quantity}</p>
                <p>Total: ${product.price * product.quantity}</p>
                <button onClick={() => removeFromCart(product)}>Remove</button>
              </div>
            ))}
          </div>
          <p>Total: ${getCartTotal().toFixed(2)}</p>

          <button onClick={() => changeView("browse")}>Back to browse</button>
          <form onSubmit={confirmationPageGo}>
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <br />
            <label>
              Email:
              <input type="email" name="email" />
            </label>
            <br />
            <label>
              Credit Card:
              <input type="text" name="creditCard" />
            </label>
            <br />
            <label>
              Address:
              <input type="text" name="address" />
            </label>
            <br />
            <input type="submit" value="Submit" />
          </form>

        </div>
      )}
      {view === "confirmation" && (
        <div>
          <h2>Confirmation</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - Quantity: {item.quantity} - Price: $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total: ${getCartTotal().toFixed(2)}</p>
          <h3>User Information</h3>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Card: {userDetails.creditcard}</p>
          <p>Address: {userDetails.address}</p>
          <button
            onClick={() => {
              leaveConfirmation()
            }}
          >
            Back to Browse
          </button>
        </div>
      )}






    </div>
  );
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
