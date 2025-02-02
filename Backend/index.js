require("dotenv").config();

const express = require("express");
const cookie_parser = require("cookie-parser")
const cors = require("cors");
const { connection } = require("./utilities/connection");
const { credential_router, dashboard_router } = require("./routes/routes");
const { checkForAuthentication } = require("./middleware/authentication");

const app = express();

connection(process.env.MONGODB_URI)
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.log("Database Connection Failed With Error:- " + err))

app.use(cookie_parser());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors({
    origin: process.env.CLIENT_URL,
    allowedHeaders: 'Content-Type',
    credentials: true
}))

app.get("", (req, res) => {
    res.send("Welcome, Cloud Cryptography Framework Server Started Successfully");
})

app.use("/", credential_router);
app.use("/dashboard/", checkForAuthentication(), dashboard_router)

app.listen(process.env.PORT, () => {
    console.log("Server Started on PORT : " + process.env.PORT);
})