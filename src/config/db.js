
const mongoose = require('mongoose');

const connectDb = function () {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.error("MongoDB connection failed:", err.message);
            process.exit(1);
        });
};

module.exports = connectDb;
