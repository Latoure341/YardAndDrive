const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookier_parser = require('cookie-parser');

const userRoute = require('./routes/userRoute.js');
const PORT = process.env.PORT;

const app = express();
dotenv.config();

//Middleware
app.use(express.json());
app.use('/api/users', userRoute);

//Auth Middle for route protection
const authToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = req.cookies.accessToken;
    if(!token){
        return res.status(401).json({message: 'access denied, token missing'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error){
        return res.status(403).json({message: 'invalid token'});
    }
};

//Protected route
app.get('/api/protected', authToken, (req, res)=> {
    res.status(200).json({ message: 'protected data access granted', user: req.user});
})

//Test route
app.get('/', (req, res)=> {
    res.status(200).send("API is running...");
})

const DB_STRING = process.env.MONGO_URL;
mongoose.connect(DB_STRING, {
    
}).then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})