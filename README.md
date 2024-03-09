```

// to single emit
// socket.on("message", (data) => {
// console.log("message-socket-id", socket.id, data);
// io.emit("received-message", data);
// });

// for send only one person
socket.on("message", (data) => {
console.log("message-socket-id", socket.id, data);
io.to(data.socketid).emit("received-message", data.text);
});

```
