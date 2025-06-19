const mongooose = require("mongoose");
const connect = mongooose.connect("mongodb://localhost:27017/ngouser");

connect.then(() => {
    console.log("Database connected successfully");
    
})
.catch(() => {
    console.log("Database cannot be connected");
})

const LoginSchema = new mongooose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    }
});

const collection = new mongooose.model("users",LoginSchema);

module.exports = collection;