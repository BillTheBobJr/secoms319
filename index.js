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
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: ""
  });


  let searchButton = document.getElementById("searchQuery");

  if (searchButton) {
    searchButton.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchBtn").click();
      }
    });
  }


  useEffect(() => {
    setProducts(productsData);
  }, []);


  const searchProducts = () => {
    let search = document.getElementById("searchQuery").value;
    const regx = new RegExp(search);
    let temp = [];
    for (const product of productsData) {
      if (regx.test(product.name)) {
        temp.push(product);
      }
    }
    setProducts(temp);
  }

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

  const getCardNumber = () => {
    let returnThis = userDetails.creditcard.toString();
    returnThis = returnThis.replace(/\d{12}/, "************");
    return returnThis;
  }

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
      address1: event.target.address1.value,
      address2: event.target.address2.value,
      city: event.target.city.value,
      state: event.target.state.value,
      zip: event.target.zip.value

    });

    changeView("confirmation");

  };

  const leaveConfirmation = () => {
    setCart([]);
    changeView("browse");
  };

  const leaveBrowse = () => {
    document.getElementById("searchQuery").value = "";
    searchProducts();
    changeView("cart");
  }

  const changeView = (newView) => {
    setView(newView);
  };

  return (
    <div className="Main" style={{ marginLeft: '1%', marginRight: '1%' }}>
      {view === "browse" && (
        <div>
          <h1>Browse Products</h1>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <form className="form-inline my-2 my-lg-0 mr-auto">
              <input className="form-control mr-sm-2" placeholder="Search" aria-label="Search" id="searchQuery"></input>
              <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={() => searchProducts()} id="searchBtn">Search</button>
            </form>
            <form className="form-inline my-2 my-lg-0">
              <button onClick={() => leaveBrowse()} className="btn btn-outline-primary">Checkout</button>
            </form>
          </nav>
          <div className="products card-columns">
            {products.map((product) => (
              <div key={product.id} className="product-card col card shadow-sm">
                <h2 className="card-title">{product.name}</h2>
                <p className="card-subtitle text-muted">Price: ${product.price}</p>
                <div>
                  <button onClick={() => addToCart(product, 1)} className="btn btn-sm btn-light">+</button>
                  <span>{getItemQuantity(product)}</span>
                  <button onClick={() => addToCart(product, -1)} className="btn btn-sm btn-light">-</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "cart" && (
        <div>
          <h1>Cart</h1>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button onClick={() => changeView("browse")} className="btn btn-outline-success">Return</button>
          </nav>
          <div className="cart-items">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product) => (
                  <tr key={product.id} className="cart-item">
                    <td>{product.name}</td>
                    <td>Quantity: {product.quantity}</td>
                    <td>Total: ${product.price * product.quantity}</td>
                    <td><button onClick={() => removeFromCart(product)} className="btn btn-light">Remove</button></td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td>Total</td>
                  <td>${getCartTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <form onSubmit={confirmationPageGo}>
            <div className="row">
              <div className="col">
                <input placeholder="Name" type="text" name="name" pattern="[A-Za-z ]+" className="form-control" required />
              </div>
              <div className="col">
                <input placeholder="Email" type="email" name="email" className="form-control" required />
              </div>
            </div>
            <br />
            <input type="password" name="creditCard" pattern="\d{16}" className="form-control" placeholder="Credit Card" required />
            <br />
            <input type="text" name="address1" placeholder="Address Line 1" className="form-control" required />
            <br />
            <input type="text" name="address2" placeholder="Address Line 2" className="form-control" />
            <br />
            <div className="row">
              <div className="col">
                <input placeholder="City" type="text" name="city" pattern="[A-Za-z ]+" className="form-control" required />
              </div>
              <div className="col">
                <input placeholder="State" type="text" name="state" pattern="[A-Za-z ]+" className="form-control" required />
              </div>
              <div className="col">
                <input placeholder="Zip" type="text" name="zip" className="form-control" pattern="\d{5}" required />
              </div>
            </div>
            <br />
            <input type="submit" value="Submit" className="btn btn-outline-primary" />
          </form>

        </div>
      )}
      {view === "confirmation" && (
        <div>
          <h2>Confirmation</h2>

          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button onClick={() => { leaveConfirmation() }} className="btn btn-outline-success">Back to Browse</button>
          </nav>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity} * ${item.price.toFixed(2)} = ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td>Total</td>
                <td>${getCartTotal().toFixed(2)}</td></tr>
            </tbody>
          </table>
          <table className="table">
            <tbody>
              <tr>
                <td>Name: {userDetails.name}</td>
                <td>Email: {userDetails.email}</td>
                <td></td>
              </tr>
              <tr>
                <td>Card: {getCardNumber()}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Address{userDetails.address2 && (" Line 1")}: {userDetails.address1}</td>
                <td></td>
                <td></td>
              </tr>
              {userDetails.address2 && (<tr><td>Address Line 2: {userDetails.address2}</td><td></td><td></td></tr>)}
              <tr>
                <td>City: {userDetails.city}</td>
                <td>State: {userDetails.state}</td>
                <td>Zip: {userDetails.zip}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}






    </div>
  );
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
