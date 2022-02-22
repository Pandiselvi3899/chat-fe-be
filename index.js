const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const path = require('path')
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')));

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://ps-we-chat.herokuapp.com",
        methods: ["GET", "POST"]
    }
})

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})
io.on("connection", (socket) => {
    // console.log(socket.id)

    socket.on("joinRoom", room => socket.join(room))

    socket.on("newMessage",({newMessage, room}) => {
        console.log(room, newMessage)
        io.in(room).emit("getLatestMessage", newMessage)
    })
});


const port = process.env.PORT || 8000
server.listen(port, () => console.log(`app started at port ${port}`))