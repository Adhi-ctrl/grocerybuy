const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const DB_FILE = "./database.json";

// Read DB
function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Save DB
function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 4));
}

// ADD PRODUCT
app.post("/add-product", (req, res) => {
    const { name, imageBase64 } = req.body;

    let db = readDB();

    const newId = db.products.length > 0 ? db.products[db.products.length - 1].id + 1 : 1;

    const newProduct = { id: newId, name, imageBase64 };
    db.products.push(newProduct);

    saveDB(db);

    res.json({
        success: true,
        product: newProduct
    });
});

// GET ALL PRODUCTS
app.get("/products", (req, res) => {
    const db = readDB();
    res.json(db.products);
});

// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);

    let db = readDB();
    db.products = db.products.filter(p => p.id !== id);

    saveDB(db);

    res.json({
        success: true,
        deletedId: id
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


app.get("/client-login", (req, res) => {
    res.sendFile(__dirname + "/client-login.html");
}); 
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/selection.html");
});

