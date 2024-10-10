const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./config/dbase");
const userRoute = require('./routers/user-route');
const chatRoute = require('./routers/chat-route');
const { notFound, errorHandler } = require("./error-handling/error-handler");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get("/",(req,res) => {
    res.send("Api is running");
});

app.use('/api/user' , userRoute);
app.use('/api/chat' , chatRoute)

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server Started"))
