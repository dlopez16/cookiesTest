const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();


const User = require("./models/user")
// const Product = require("./models/product")
// const corsOptions = {
//     origin: '*',
//     credentials: true,
//     optionSuccessStatus: 200,
// }

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

//needed to receive the request body json for the POSt request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json())



mongoose.connect("mongodb://localhost:27017/test")
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

let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, email) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken(email)
        res.json({ accessToken: accessToken })
    })
})

app.delete("/logout", (req, res) => {
    //this will return an array without the req.body.token that was added there in the token route,  
    // essencially whould return a empty array deleting the refresh token
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.clearCookie('token', {});
    res.sendStatus(204);
    console.log(refreshTokens)
})


app.get('/user', authenticateToken, async (req, res, next) => {
    try {
        const email = req.email.userEmail;
        let user = await User.findOne({ email })
        res.json({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        })
    } catch (err) {
        res.sendStatus(500) && next(err);
    }
})

app.get("/signin", (req, res) => {
    console.log(req.cookies)
    // res.cookie('session_id', "1234");
    res.status(200).json({ msg: "logged in" })
})

app.post('/signin', async (req, res) => {

    // try {
    const { email, password } = req.body
    let user = await User.findOne({ email })

    if (!password || !email) {
        res.send({ message: "Invalid Credentials" })
    }

    if (!user) {
        res.send({ error: "Invalid Credentials" });
    }
    //compares the password with the hashed password in the db
    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword) {
        // uses generateAccessToken function which accepts two attributes (userEmail, expiresIn)
        const accessToken = generateAccessToken(email, "1m")
        //creates a refresh token with a signanture, which takes the user email and the Refresh Token Secret
        res.cookie("token", accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 15,
            secure: false,
            signed: false
        });
        const refreshToken = jwt.sign(email, process.env.REFRESH_TOKEN_SECRET)
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
            signed: false
        });
        user.refresh_tokens.push({
            token: refreshToken,
            expiration: new Date(date.now() + 1000 * 60 * 60 * 24)
        });
        await user.save();
        //this should be store in the db, right now is saved locally to test it
        refreshTokens.push(refreshToken)
        //responds with a status 200 and with a json with the accesstoken and refreshtoken
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
        console.log("error")
        res.send({ error: "Invalid Credentials" })
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err) return res.sendStatus(403)
        req.email = email
        next()
    })
}

function generateAccessToken(userEmail) {
    //creates a access tokent that takes the usermail and expiresIn value, this function is called inside the /signin post route
    return jwt.sign({ userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" })

}

// function cookieJwtAuth(req, res, next) {
//     const token = req.cookies.token
//     try {
//         const userEmail = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//         req.userEmail = userEmail;
//         next()
//     } catch (err) {
//         res.clearCookie("token")
//     }
// }

// function validateCookie(req, res, next) {
//     const { cookies } = req;
//     console.log(cookies);
//     if ("session_id" in cookies) {
//         console.log("Session Id exists")
//         if (cookies.session_id === "1234") next()
//         else res.status(500).json({ msg: "not authorized" })
//     } else res.status(500).json({ msg: "not authorized" })
// }


app.post('/register', async (req, res) => {
    console.log(req.body);
    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);



    const newUser = new User({
        firstName: first_name,
        lastName: last_name,
        email: email,
        password: hash,
    })
    const user = await newUser.save()
    console.log(user);
    res.status(200).json(user);
})



app.listen(4800, () => {
    console.log(`Listening on port: 4800`);
});