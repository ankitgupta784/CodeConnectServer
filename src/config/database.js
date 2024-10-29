const mongoose = require("mongoose");

const connectDB = async () => {
   await mongoose.connect("mongodb+srv://ankit784:ankit784@namastenode.eq2g7.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=NamasteNode")
}

module.exports = connectDB;