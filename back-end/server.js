const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./config/dbase");
const userRoute = require('./routers/user-route');
const chatRoute = require('./routers/chat-route');
const messageRoute = require('./routers/message-route');
const { notFound, errorHandler } = require("./error-handling/error-handler");
const path = require("path");
const exp = require("constants");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api/user' , userRoute);
app.use('/api/chat' , chatRoute);
app.use('/api/msg' , messageRoute);

// Deploy
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, '/front-end/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'front-end', 'dist', 'index.html'));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running");
    });
}

// Deploy

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log("Server Started"))

const io = require("socket.io")(server , {
    pingTimeout: 60000,
    cors:{
        origin:"http://localhost:5173"
    }
});

io.on("connection" , (socket) => {

    socket.on("setup" , (userData) => {
        socket.join(userData._id);
        socket.emit("connection");
    })

    socket.on("Join", (room) => {
        socket.join(room);
        //console.log("User Joined " + room);
    })

    socket.on("Typing", (room) => socket.in(room).emit("Typing"))
    socket.on("NotTyping", (room) => socket.in(room).emit("NotTyping"))

    socket.on("Recieved", (messageRecieved) => {
        var chat = messageRecieved.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == messageRecieved.sender._id) return;

            socket.in(user._id).emit("Message Recieved", messageRecieved)
        });
    })

    socket.off("setup", () => {
        //console.log("User Disconnected");
        socket.leave(useData._id);
    })

});