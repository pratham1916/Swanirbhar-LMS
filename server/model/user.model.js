const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2')

const userSchema = mongoose.Schema({
    fullname: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ['student', 'instructor'], default: 'student' }
}, { versionKey: false });

userSchema.plugin(paginate);
const userModel = mongoose.model("user", userSchema);

module.exports = {
    userModel
};
