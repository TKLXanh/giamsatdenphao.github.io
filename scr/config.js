const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://admin:admin@cluster0.tsod3fd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

connect.then(() => {
    console.log('Connect successfully')
})
.catch(() => {
    console.log("Connect False")
})

const loginSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model("Users", loginSchema);

module.exports = collection;