const bcrypt = require('bcrypt');
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
    } catch (error) {
        return res.status(500).json({ message: 'server error' });
    }
}

module.exports = { registerUser, loginUser };
