
(async() => {
    let link = ""
    let req = await fetch(`${document.URL}/config.json`);
    req = await req.json()
    link = req.LINK;


    let socket = new WebSocket(`ws://${link}`)

    socket.onopen = () => {
        socket.send("User Connected !")
    }
    
    let username = document.querySelector("input");
    let message = document.querySelector("textarea");
      
    if(localStorage.getItem("username") != undefined) {
        username.value = localStorage.getItem("username")
    }
    
    document.querySelector("button").addEventListener("click", (ev) => {
        ev.preventDefault()
    
    if(username.value.length == 0) return alert("Empty username")
    
    localStorage.setItem("username", username.value);
      if(message.value.length == 0) return alert("Empty message")
        let msg = `${username.value} : ${message.value}`
       socket.send(msg)
    })
    socket.onmessage = (ev) => {
        let ul = document.querySelector("ul");
        let new_li = document.createElement("li")
        new_li.textContent = ev.data;
        ul.appendChild(new_li)
            
    }
    
    
    
})()

