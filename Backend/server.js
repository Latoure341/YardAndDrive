const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const userRoute = require('./routes/userRoute.js');
const PORT = process.env.PORT;

const app = express();
dotenv.config();

//Middleware
app.use(express.json());
app.use('/api/users', userRoute);

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