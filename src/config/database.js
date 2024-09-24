const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://imvivek2202:vtbN0IHMMhlfP2rv@mydatabase.uovlx.mongodb.net/devTinder"
    );
};

module.exports = connectDB;

