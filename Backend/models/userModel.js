const mongoos = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "user name required"],
        default: "User"
    },
    userEmail: {
        type: String,
        required: [true, "user email required"],
        unique: true
    },
    userPassword: {
        type: String,
        required: [true, "user password required"]
    }
},
{
    timestamps: true
}
)
const User = mongoose.model('User', userSchema);
module.exports = User;