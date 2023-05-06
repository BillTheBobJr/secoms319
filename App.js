const mysql = require('mysql2');
// or as an es module:
// import { MongoClient } from 'mongodb'
// Connection URL
var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var port = "8081";
var host = "localhost";


var con = mysql.createConnection({
    host: "localhost",
    user: "javaScriptUser",
    password: "password",
    database: "carrental"
});

app.get("/car", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    let results = await con.promise().query("SELECT * FROM car");

    res.send(results[0]).status(200);
    console.log(results[0]);
});

app.get("/car/:id", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const id = req.params.id;

    let results = await con.promise().query("SELECT * FROM car WHERE \"" + id + "\"=car.id");

    res.send(results[0]).status(200);
    console.log(results[0]);
});

app.get("/time/:car", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const car = req.params.car;

    let results = await con.promise().query("UPDATE user SET id = \"" + newId + "\" WHERE id = \"" + id + "\"");
    res.send(results[0]).status(200);
    console.log(results[0]);
});

app.put("/car/update/:id/:price", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const id = req.params.id;
    const newprice = req.params.price;

    let results = await con.promise().query("UPDATE car SET price = \"" + newprice + "\" WHERE id = \"" + id + "\"");
    res.status(200);
    console.log(results[0])
});

app.post("/time/reserve", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);

    console.log(values);

    let results = await con.promise().query("insert into time (carId, startDate, endDate, price, name, email)  value (\"" + values[0] + "\", \"" + values[1] + "\", \"" + values[2] + "\", " + values[3] + ", \"" + values[4] + "\", \"" + values[5] + "\")");
    console.log(results[0]);
    res.status(200);
});

app.delete("/time/drop/:timeId", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const timeId = req.params.timeId;

    let results = await con.promise().query("DELETE FROM time where id = " + timeId);
    console.log(results[0]);
    res.status(200);
});

app.use(cors());
app.use(bodyParser.json());
app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});