const { MongoClient } = require('mongodb');

var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'reactdata';
const collectionName = 'fakestore_catalog';
const client = new MongoClient(url);
const db = client.db(dbName);


app.get("/allProducts", (req, res) => {
    fs.readFile(__dirname + "/" + "temp.json", "utf8", (err, data) => {
        console.log(data);
        res.status(200);
        res.send(data);
    });
});

app.get("/allProductsMongo", async (req, res) => {
    await client.connect();
    const query = {};
    const results = await db
        .collection(collectionName)
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
    client.close();
});


app.get("/product/:id", async (req, res) => {
    const value = Number(req.params.id);
    await client.connect();

    const query = { _id: value }

    const results = await db.collection(collectionName)
        .findOne(query);
    
    console.log(resutls);

    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
    client.close();
});

app.post("/addProduct", async (req, res) => {
    await client.connect();

    const p_id = req.body._id;
    const ptitle = req.body.title;
    const pprice = req.body.price;
    const pdescription = req.body.description;
    const pcategory = req.body.category;
    const pimage = req.body.image;
    const prate = req.body.rating.rate;
    const pcount = req.body.rating.count;

    const newDocument = {
        _id: p_id,
        title: ptitle,
        price: pprice,
        description: pdescription,
        category: pcategory,
        image: pimage,
        rating: {
            rate: prate,
            count: pcount
        }
    };

    const results = await db.collection(collectionName).insertOne(newDocument);
    res.status(200);
    res.end(results);
    client.close();
});


app.put("/changePrice/id/:id/price/:price", async (req, res) => {
    const id = Number(req.params.id);
    const value = Number(req.params.price);
    console.log(id + "   " + value);
    await client.connect();

    const results = await db.collection(collectionName)
        .updateOne({ _id: id }, { $set: { price: value } });

    res.status(200);
    res.end();
    client.close();
});


app.delete("/deleteProduct/:id", async (req, res) => {
    const id = Number(req.params.id);

    await client.connect();

    const results = await db.collection(collectionName)
        .deleteOne({ _id: id });
    res.status(200);
    res.end();
    client.close();
})



async function main() {

    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    return 'done.';
}

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});