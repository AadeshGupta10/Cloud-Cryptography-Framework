const mongoose = require("mongoose");

let mongoClient;

const connection = async (database_url) => {
    try {
        if (mongoClient) {
            return mongoClient
        }
        else {
            mongoClient = await mongoose.connect(database_url);
            return mongoClient;
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    connection
}