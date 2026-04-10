const cookieParser = require("cookie-parser");
const express = require("express")
const authRoute = require("./routes/auth.route")
const songRouter = require("./routes/song.route")
const cors = require("cors")
const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRoute)
app.use("/api/song", songRouter)

module.exports = app;