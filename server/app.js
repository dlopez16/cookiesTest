const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const User = require("./models/user")
// const Product = require("./models/product")

app.use(cors());

//needed to receive the request body json for the POSt request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




mongoose.connect("mongodb://localhost:27017/clothingStore")
    .then(() => {
        console.log("Connection Open!")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })


// app.get('/products', async (req, res) => {
//     const products = await Product.find({})
//     console.log(products)
//     res.status(200).json(products);
// })


app.post('/signin', async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    // if email and password is not return send error code 500
    if (!email || !password) {
        return res.sendStatus(500)
    }
    let user = await User.findOne({ email })
    // if the email is not found send error
    if (!user) {
        return res.sendStatus(500)
    }
    if (user.password !== password) {
        return res.sendStatus(500)
    }
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    })
})


app.listen(4800, () => {
    console.log(`Listening on port: 4800`);
});