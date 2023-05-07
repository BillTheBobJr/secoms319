const mysql = require('mysql2');
var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var port = "8081";
var host = "localhost";

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));
app.listen(port, host, () => {
    console.log("App listening at http://%s:%s", host, port);
});


var con = mysql.createConnection({
    host: "localhost",
    user: "javaScriptUser", // root
    password: "password",  // test
    database: "carrental" //reactmysql
});

app.get("n", async (req, res) => {
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

app.get("/cars", (req, res) => {

    con.query("SELECT * FROM car", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });

});

app.get("/time/:car", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const car = req.params.car;

    let results = await con.promise().query("SELECT * FROM time WHERE carId = \"" + car + "\"");
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
    console.log(results[0].insertId);
    res.status(200).send(JSON.stringify(results[0]));
});

app.delete("/time/drop/:timeId", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const timeId = req.params.timeId;

    let results = await con.promise().query("DELETE FROM time where id = " + timeId);
    console.log(results[0]);
    res.status(200).end();

});
