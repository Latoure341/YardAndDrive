const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

//register user
const registerUser = async (req, res) => {

    const { userName, userEmail, userPassword } = req.body;

    //Hashing the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    try {
        const existingUser = await userModel.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'user already exists' });
        }
        else {
            const newUser = new userModel({
                userName,
                userEmail,
                userPassword: hashedPassword
            });
            await newUser.save();
            return res.status(201).json({
                message: 'user registered successfully'
            })
        }
    } catch (error) {
        return res.status(500).json({ message: 'server error' });
    }
}

//login user
const loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;

    try {
        const user = await userModel.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        
        //Compare the hashed password
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'invalid password' });
        }

        //jwt token generated here (not implemented)
        const token = jwt.sign({ userId: user.id, userEmail: user.userEmail}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15*60*1000
        });
        
        res.status(200).json({ message: 'login successful', token});
    } catch (error) {
        return res.status(500).json({ message: 'server error' });
    }
}

module.exports = { registerUser, loginUser };
