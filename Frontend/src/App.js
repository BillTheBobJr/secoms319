import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const hostname = "http://127.0.0.1:4000";
  const [cars, setCars] = useState([]);
  const [currentCar, setCurrentCar] = useState(null);
  const [rentCarId, setRentCarId] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reservedTimes, setReservedTimes] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardExpiry, setCreditCardExpiry] = useState("");
  const [creditCardCVV, setCreditCardCVV] = useState("");
  const [userAddress, setUserAddress] = useState({
    street: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
  });
  const [checkout, setCheckout] = useState(false);
  const [cost, setCost] = useState(0);
  const [priceChangeValue, setPriceChangeValue] = useState('');
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [showCredits, setShowCredits] = useState(null);




  useEffect(() => {
    async function fetchCars() {
      const response = await axios.get(`${hostname}/cars`);
      console.log(response.data);
      setCars(response.data);
    }
    fetchCars();
  }, []);

  useEffect(() => {
    if (rentCarId) {
      async function fetchReservedTimes() {
        const response = await axios.get(`${hostname}/time/${rentCarId}`);
        setReservedTimes(response.data);
      }
      fetchReservedTimes();
    }
  }, [rentCarId]);

  useEffect(() => {
    calculateCost();
  }, [startDate, endDate]);



  const handleDetailsClick = async (carId) => {
    const response = await axios.get(`${hostname}/car/${carId}`);
    setCurrentCar(response.data[0]);
  };


  const handleRentClick = (carId) => {
    setCurrentCar(null);
    setRentCarId(carId);
  };

  const handleBackClick = () => {
    setCurrentCar(null);
    setRentCarId(null);
    setCheckout(null);
    setShowCredits(null);
  };

  const checkAvailability = () => {
    const isAvailable = reservedTimes.every((time) => {
      const reservedStart = new Date(time.startDate);
      const reservedEnd = new Date(time.endDate);

      return (startDate < reservedStart && endDate <= reservedStart) || (startDate >= reservedEnd && endDate > reservedEnd);
    });

    setAvailabilityMessage(isAvailable ? "Available" : "Not Available. Please select different dates.");
  };

  async function handleCheckout(carId) {
    console.log(carId);
    if (availabilityMessage === "Available") {
      await axios.post(`${hostname}/time/reserve`, {
        carId: rentCarId,
        startDate: startDate.toISOString().substr(0, 10),
        endDate: endDate.toISOString().substr(0, 10),
        price: cost,
        name: userName,
        email: userEmail,
        cardNum: creditCardNumber,
        epir: creditCardExpiry,
        cvv: creditCardCVV,
        address: userAddress
      });
      setCheckout(true);
    } else {
      alert("Dates Not Available. Please select different dates:")
    }
  }

  function calculateCost() {
    if (rentCarId && startDate && endDate) {
      const car = cars.find((car) => car.id === rentCarId);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      const totalCost = Math.round(days) * car.price;
      setCost(totalCost);
    } else {
      setCost(0);
    }
  }

  async function handlePriceChange(id) {
    const tempPrice = priceChangeValue;
    currentCar.price = priceChangeValue;

    setPriceChangeValue(null);
    setShowPriceInput(false);

    await axios.put(`${hostname}/car/update/${id}/${tempPrice}`);

  }



  if (showCredits) {
    return (
      <div>
        <section class="py-5 text-center container">
          <div class="row py-lg-5">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="fw-light">Credits: COMS 319 Construction of User Interfaces, Spring 2023</h1>
              <h3>Date: 5/06/2023</h3>
            </div>
          </div>
        </section>

        <div class="row">
          <div class="col">
            <div class="container text-center">
              <h2>Name: Spencer Dunham</h2>
              <h2>Email: sdunham@iastate.edu</h2>

            </div>
          </div>
          <div class="col">
            <div class="container text-center">
              <h2>Name: Alex Chambers</h2>
              <h2>Email: anc1@iastate.edu</h2>

            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-auto">
          <button class="btn btn-secondary btn-lg btn-block mr-2" onClick={handleBackClick}>Back to Homepage</button>
        </div>
      </div >
    );
  }


  if (checkout) {
    const car = cars.find((car) => car.id === rentCarId);
    return (
      <div class="container">
        <h1 class="mt-4">Confirmation</h1>
        <h2>Car Details:</h2>
        <h3>{car.name}</h3>
        <p>{car.description}</p>
        <h2>Cost:</h2>
        <p>${cost}</p>
        <h2>Rental Dates:</h2>
        <p>
          From: {startDate.toISOString().substr(0, 10)} To:{" "}
          {endDate.toISOString().substr(0, 10)}
        </p>
        <h2>Payment Information:</h2>
        <p>Last 4 digits of credit card: {creditCardNumber.slice(-4)}</p>
        <h2>Address:</h2>
        <p>
          {userAddress.street}, {userAddress.city}, {userAddress.state},{" "}
          {userAddress.country}, {userAddress.postalCode}
        </p>
        <button class="btn btn-primary" onClick={handleBackClick}>Back to Homepage</button>
      </div>
    );
  }


  if (currentCar) {
    return (
      <div class="div text-center">
        <h1 class="mt-4">{currentCar.name}</h1>
        <img src={currentCar.image} alt={currentCar.name} height="500px" />
        <p>{currentCar.description}</p>
        <p>Rental Rate: ${currentCar.price}/day</p>
        {!showPriceInput && <button onClick={() => setShowPriceInput(true)} class="btn btn-success mr-2">Change Price</button>}
        {showPriceInput && (
          <div>
            <div class="input-group justify-content-center">
              <form onSubmit={function (event) {
                handlePriceChange(currentCar.id);
                window.location.reload()
              }}>
                <input
                  type="number"
                  value={priceChangeValue}
                  onChange={(e) => setPriceChangeValue(e.target.value)}
                  placeholder="Enter new price"
                  required
                />
                <div class="input-group-append">
                  <button type="submit" value="Submit" class="btn btn-sm btn-success mr-2">Update Price</button>
                  <button onClick={() => setShowPriceInput(false)} class="btn btn-sm btn-success mr-1">Done</button>
                </div>
              </form>
            </div>
            <br />
          </div>
        )}
        <button class="btn btn-primary mr-2" onClick={() => handleRentClick(currentCar.id)}>Rent</button>
        <button class="btn btn-secondary" onClick={handleBackClick}>Back to Homepage</button>
      </div>
    );
  }

  if (rentCarId) {
    return (
      <div class="container">
        <div class="row">
          <div class="col-md-6 mt-4">
            <h1 class="mt-4">Rent Car ID: {rentCarId}</h1>
            <div class="form-group">
              <label>Start Date:</label>
              <input class="form-control" type="date" value={startDate.toISOString().substr(0, 10)} onChange={event => setStartDate(new Date(event.target.value))} />
            </div>
            <div class="form-group">
              <label>End Date:</label>
              <input class="form-control" type="date" value={endDate.toISOString().substr(0, 10)} onChange={event => setEndDate(new Date(event.target.value))} />
            </div>
            <button class="btn btn-primary mb-3" onClick={checkAvailability}>Check Availability</button>
            <p>Cost: ${cost}</p>
            <p>{availabilityMessage}</p>
            <button class="btn btn-secondary" onClick={handleBackClick}>Back to Homepage</button>
          </div>
          <div class="col-md-6 mt-4" >
            <h2 class="mt-4">Enter your information:</h2>
            <form onSubmit={function (event) { event.preventDefault(); handleCheckout(rentCarId) }}>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="Name" value={userName} pattern="[A-Za-z]*" onChange={(event) => setUserName(event.target.value)} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="email" placeholder="Email" value={userEmail} pattern="[A-Za-z0-9]*@[A-Za-z]*\.[A-Za-z]*" onChange={(event) => setUserEmail(event.target.value)} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="Credit Card Number" value={creditCardNumber} pattern="\d{16}" onChange={(event) => setCreditCardNumber(event.target.value)} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="Expiry Date (MM/YY)" value={creditCardExpiry} pattern="\d\d/\d\d" onChange={(event) => setCreditCardExpiry(event.target.value)} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="CVV" value={creditCardCVV} pattern="\d\d\d" onChange={(event) => setCreditCardCVV(event.target.value)} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="Street" value={userAddress.street} pattern="[A-Za-z0-9 ]*" onChange={(event) => setUserAddress({ ...userAddress, street: event.target.value })} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="City" value={userAddress.city} pattern="[A-Za-z ]*" onChange={(event) => setUserAddress({ ...userAddress, city: event.target.value })} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="Country" value={userAddress.country} pattern="[A-Za-z ]*" onChange={(event) => setUserAddress({ ...userAddress, country: event.target.value })} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="state" value={userAddress.state} pattern="[A-Za-z ]*" onChange={(event) => setUserAddress({ ...userAddress, state: event.target.value })} required />
              </div>
              <div class="form-group">
                <input class="form-control" type="text" placeholder="Postal Code" value={userAddress.postalCode} pattern="\d{5}" onChange={(event) => setUserAddress({ ...userAddress, postalCode: event.target.value })} required />
              </div>
              <button type="submit" class="btn btn-primary" value="Submit">Checkout</button>
            </form>
          </div>
        </div>
      </div>
    );
  }





  return (
    <div class="container">
      <h1 class="mt-4 text-center">Welcome to Ames Car Rental Site!</h1>

      <p class="lead text-muted text-center">Experience the freedom of the open road with our rental cars. Whether you
        need a car for business or
        pleasure, we have a wide selection of vehicles to choose from, including luxury cars, SUVs, and
        economy
        models. Our cars are well-maintained and regularly serviced, so you can enjoy a smooth and
        comfortable
        ride. With flexible rental options and competitive pricing, we make it easy for you to get
        behind
        the
        wheel and explore the world at your own pace. Book your rental car today and let the journey
        begin!</p>
      <img src="./images/cars.png" alt="Your Image Description" className="img-fluid w-100" />
      <div class="row">
        {cars.map(car => (
          <div key={car.id} class="col-md-4 mt-4">
            <div class="card">
              <img class="card-img-top" src={car.image} alt={car.name} height="250px" width="auto" />
              <div class="card-body">
                <h5 class="card-title">{car.name}</h5>
                <p class="card-text">{car.description}</p>
                <button class="btn btn-primary mr-2" onClick={() => handleDetailsClick(car.id)}>See details</button>
                <button class="btn btn-secondary" onClick={() => handleRentClick(car.id)}>Rent</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end mt-auto">
        <button className="btn btn-secondary btn-lg btn-block mr-2" onClick={() => setShowCredits(true)}>
          credits
        </button>
      </div>
    </div >

  );
}

export default App;
