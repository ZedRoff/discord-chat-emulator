const WebSocket = require("ws")
const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json")
const axios = require("axios")
const dotenv = require("dotenv")
const express = require("express")
const app = express()
const config = require("./public/config.json")
const server = app.listen(config.PORT || 3000, () => console.log("Application is running on the URL : " + config.LINK))
const wss = new WebSocket.Server({server})
let users = []

app.use(express.static('public'))
dotenv.config()

let payload ={
    "op": 2,
    "d": {
      "token": process.env.TOKEN,
      "intents": 131071,
      "properties": {
        "os": "linux",
        "browser": "my_library",
        "device": "my_library"
      }
    }
}

app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/index.html")
})


ws.on("open", () => {
    ws.send(JSON.stringify(payload))
})

ws.on("message", ev => {
    let { t, d, op } = JSON.parse(ev);
    if(op == 10) {
        const { heartbeat_interval } = d;
        setInterval(() => {
            ws.send(JSON.stringify({op: 1, d: null}))
         }, heartbeat_interval)
         return;
    }

    switch(t) {
        case "MESSAGE_CREATE":
            if(d.author.id == config.BOTID && d.content != "User Connected !") {
                for(user of users) {
                    let msg = `${d.content}`
                        user.send(msg)
                    }
                    return;
            };
            
                   for(user of users) {
                    let msg = `${d.author.username} : ${d.content}`
                        user.send(msg)
                    }
             break;
    }
})

wss.on("connection", (socket) => {
    users.push(socket)
    socket.on("message", (ev) => {
        axios.post(`https://discord.com/api/v10/channels/${config.CHANID}/messages`, {"content": ev.toString()}, {headers: {"Authorization": `Bot ${process.env.TOKEN}`, "Accept-Encoding": "gzip,deflate,compress"}})   
    })
})
