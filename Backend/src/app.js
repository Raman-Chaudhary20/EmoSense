const cookieParser = require("cookie-parser");
const express = require("express")
const authRoute = require("./routes/auth.route")
const app = express()

app.use(cookieParser());
app.use(express.json())
app.use("/api/auth", authRoute)

app.use
module.exports = app;