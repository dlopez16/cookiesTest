const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {type: String, enum: ["Customer", "Staff", "Admin"], required: true},
    refresh_tokens: [{
        token: {type: String, required: true},
        expiration: {type: Date, required: true}
    }]
})

const User = mongoose.model("User", UserSchema);


module.exports = User;